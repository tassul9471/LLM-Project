import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { UserModel } from '../models/User.js';
import { ProductModel } from '../models/Product.js';
import { AdvertisementModel } from '../models/Advertisement.js';

export class AdminController {
  /**
   * GET /api/admin/dashboard
   * Returns real overview stats, recent items, and analytics aggregates
   */
  static async getDashboard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const allUsers = UserModel.find();
      const allProducts = ProductModel.find();
      const allAds = AdvertisementModel.find();

      // Recent users (without passwordHash)
      const recentUsers = allUsers.slice(0, 5).map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role || 'user',
        createdAt: u.createdAt,
      }));

      // Recent advertisements with owner name
      const recentAds = allAds.slice(0, 5).map((a) => {
        const owner = allUsers.find((u) => u._id === a.userId);
        return {
          _id: a._id,
          productName: a.productName,
          ownerName: owner ? owner.name : 'Unknown User',
          ownerEmail: owner ? owner.email : '',
          tone: a.tone,
          platform: a.platform,
          headline: a.editedContent?.headline || a.generatedContent.headline,
          createdAt: a.createdAt,
        };
      });

      // Simple analytics breakdowns
      const platformCounts: Record<string, number> = {};
      const toneCounts: Record<string, number> = {};

      allAds.forEach((a) => {
        platformCounts[a.platform] = (platformCounts[a.platform] || 0) + 1;
        toneCounts[a.tone] = (toneCounts[a.tone] || 0) + 1;
      });

      // Group registrations by month/date
      const userRegistrationsByMonth: Record<string, number> = {};
      allUsers.forEach((u) => {
        const dateKey = u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recent';
        userRegistrationsByMonth[dateKey] = (userRegistrationsByMonth[dateKey] || 0) + 1;
      });

      res.status(200).json({
        success: true,
        stats: {
          totalUsers: allUsers.length,
          totalProducts: allProducts.length,
          totalAds: allAds.length,
          recentUsers,
          recentAds,
          platformBreakdown: platformCounts,
          toneBreakdown: toneCounts,
          activityTimeline: Object.entries(userRegistrationsByMonth).map(([date, count]) => ({ date, count })),
        },
      });
    } catch (err: any) {
      console.error('Admin dashboard error:', err);
      res.status(500).json({ success: false, error: 'Failed to load admin dashboard statistics.' });
    }
  }

  /**
   * GET /api/admin/users
   * Lists all users with their product and ad counts
   */
  static async getUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const search = (req.query.search as string || '').toLowerCase().trim();
      let users = UserModel.find();

      if (search) {
        users = users.filter((u) =>
          u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search)
        );
      }

      const allProducts = ProductModel.find();
      const allAds = AdvertisementModel.find();

      const usersWithStats = users.map((u) => {
        const productCount = allProducts.filter((p) => p.userId === u._id).length;
        const adCount = allAds.filter((a) => a.userId === u._id).length;

        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.role || 'user',
          createdAt: u.createdAt,
          productCount,
          adCount,
        };
      });

      res.status(200).json({
        success: true,
        count: usersWithStats.length,
        users: usersWithStats,
      });
    } catch (err: any) {
      console.error('Admin get users error:', err);
      res.status(500).json({ success: false, error: 'Failed to load user list.' });
    }
  }

  /**
   * GET /api/admin/users/:id
   */
  static async getUserById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = UserModel.findById(id);
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found.' });
        return;
      }

      const products = ProductModel.find({ userId: id });
      const ads = AdvertisementModel.find({ userId: id });

      res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'user',
          createdAt: user.createdAt,
          products,
          ads,
        },
      });
    } catch (err: any) {
      console.error('Admin get user detail error:', err);
      res.status(500).json({ success: false, error: 'Failed to load user details.' });
    }
  }

  /**
   * DELETE /api/admin/users/:id
   * Cascades products and ads of the deleted user, prevents self-deletion
   */
  static async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Prevent admin from deleting themselves
      if (id === req.user?.id) {
        res.status(400).json({
          success: false,
          error: 'Action prohibited: You cannot delete your own admin account while logged in.',
        });
        return;
      }

      const user = UserModel.findById(id);
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found.' });
        return;
      }

      // Safely cascade delete user's products
      const userProducts = ProductModel.find({ userId: id });
      userProducts.forEach((p) => ProductModel.findByIdAndDelete(p._id));

      // Safely cascade delete user's advertisements
      const userAds = AdvertisementModel.find({ userId: id });
      userAds.forEach((a) => AdvertisementModel.findByIdAndDelete(a._id));

      // Delete user
      UserModel.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: `User ${user.name} and all related records were successfully removed.`,
      });
    } catch (err: any) {
      console.error('Admin delete user error:', err);
      res.status(500).json({ success: false, error: 'Failed to delete user.' });
    }
  }

  /**
   * GET /api/admin/products
   */
  static async getProducts(req: AuthRequest, res: Response): Promise<void> {
    try {
      const search = (req.query.search as string || '').toLowerCase().trim();
      let products = ProductModel.find();
      const allUsers = UserModel.find();

      if (search) {
        products = products.filter((p) =>
          p.name.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
        );
      }

      const productsWithOwner = products.map((p) => {
        const owner = allUsers.find((u) => u._id === p.userId);
        return {
          ...p,
          ownerName: owner ? owner.name : 'Unknown User',
          ownerEmail: owner ? owner.email : '',
        };
      });

      res.status(200).json({
        success: true,
        count: productsWithOwner.length,
        products: productsWithOwner,
      });
    } catch (err: any) {
      console.error('Admin get products error:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve products.' });
    }
  }

  /**
   * GET /api/admin/products/:id
   */
  static async getProductById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = ProductModel.findById(id);
      if (!product) {
        res.status(404).json({ success: false, error: 'Product not found.' });
        return;
      }

      const owner = UserModel.findById(product.userId);

      res.status(200).json({
        success: true,
        product: {
          ...product,
          ownerName: owner ? owner.name : 'Unknown User',
          ownerEmail: owner ? owner.email : '',
        },
      });
    } catch (err: any) {
      console.error('Admin get product detail error:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve product details.' });
    }
  }

  /**
   * DELETE /api/admin/products/:id
   */
  static async deleteProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = ProductModel.findById(id);
      if (!product) {
        res.status(404).json({ success: false, error: 'Product not found.' });
        return;
      }

      ProductModel.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: `Product "${product.name}" deleted successfully by administrator.`,
      });
    } catch (err: any) {
      console.error('Admin delete product error:', err);
      res.status(500).json({ success: false, error: 'Failed to delete product.' });
    }
  }

  /**
   * GET /api/admin/ads
   */
  static async getAds(req: AuthRequest, res: Response): Promise<void> {
    try {
      const search = (req.query.search as string || '').toLowerCase().trim();
      let ads = AdvertisementModel.find();
      const allUsers = UserModel.find();

      if (search) {
        ads = ads.filter((a) => {
          const headline = a.editedContent?.headline || a.generatedContent.headline;
          return (
            a.productName.toLowerCase().includes(search) ||
            headline.toLowerCase().includes(search) ||
            a.tone.toLowerCase().includes(search) ||
            a.platform.toLowerCase().includes(search)
          );
        });
      }

      const adsWithOwner = ads.map((a) => {
        const owner = allUsers.find((u) => u._id === a.userId);
        return {
          _id: a._id,
          productId: a.productId,
          productName: a.productName,
          tone: a.tone,
          platform: a.platform,
          contentLength: a.contentLength,
          adType: a.adType,
          headline: a.editedContent?.headline || a.generatedContent.headline,
          shortDescription: a.editedContent?.shortDescription || a.generatedContent.shortDescription,
          createdAt: a.createdAt,
          ownerName: owner ? owner.name : 'Unknown User',
          ownerEmail: owner ? owner.email : '',
        };
      });

      res.status(200).json({
        success: true,
        count: adsWithOwner.length,
        ads: adsWithOwner,
      });
    } catch (err: any) {
      console.error('Admin get ads error:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve advertisements.' });
    }
  }

  /**
   * GET /api/admin/ads/:id
   */
  static async getAdById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const ad = AdvertisementModel.findById(id);
      if (!ad) {
        res.status(404).json({ success: false, error: 'Advertisement not found.' });
        return;
      }

      const owner = UserModel.findById(ad.userId);

      res.status(200).json({
        success: true,
        ad: {
          ...ad,
          ownerName: owner ? owner.name : 'Unknown User',
          ownerEmail: owner ? owner.email : '',
        },
      });
    } catch (err: any) {
      console.error('Admin get ad detail error:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve advertisement details.' });
    }
  }

  /**
   * DELETE /api/admin/ads/:id
   */
  static async deleteAd(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const ad = AdvertisementModel.findById(id);
      if (!ad) {
        res.status(404).json({ success: false, error: 'Advertisement not found.' });
        return;
      }

      AdvertisementModel.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'Advertisement deleted successfully by administrator.',
      });
    } catch (err: any) {
      console.error('Admin delete ad error:', err);
      res.status(500).json({ success: false, error: 'Failed to delete advertisement.' });
    }
  }
}
