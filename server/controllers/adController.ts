import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { AdvertisementModel } from '../models/Advertisement.js';
import { ProductModel } from '../models/Product.js';
import { AiService } from '../services/aiService.js';

export class AdController {
  /**
   * Stage 7 & 8: Generate advertisement content via Gemini AI
   */
  static async generate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        name,
        category,
        description,
        features,
        benefits,
        audience,
        price,
        offer,
        tone,
        platform,
        contentLength,
        adType,
        isRegeneration,
      } = req.body;

      const generatedContent = await AiService.generateAdvertisement({
        name,
        category,
        description,
        features,
        benefits,
        audience,
        price,
        offer,
        tone,
        platform,
        contentLength,
        adType,
        isRegeneration: Boolean(isRegeneration),
      });

      res.status(200).json({
        success: true,
        message: isRegeneration ? 'Advertisement regenerated successfully.' : 'Advertisement generated successfully.',
        generatedContent,
      });
    } catch (err: any) {
      console.error('Ad generation controller error:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Failed to generate advertisement.',
      });
    }
  }

  /**
   * Stage 9: Save advertisement to database
   */
  static async save(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const {
        productId,
        productName,
        tone,
        platform,
        contentLength,
        adType,
        generatedContent,
        editedContent,
      } = req.body;

      if (!generatedContent || !generatedContent.headline) {
        res.status(400).json({ success: false, error: 'Valid generated content is required to save an advertisement.' });
        return;
      }

      // Verify product ownership if productId is provided
      let resolvedProductName = productName || 'Custom Product';
      if (productId) {
        const product = ProductModel.findById(productId);
        if (product && product.userId === userId) {
          resolvedProductName = product.name;
        }
      }

      const ad = AdvertisementModel.create({
        userId,
        productId: productId || null,
        productName: resolvedProductName,
        tone: tone || 'Modern',
        platform: platform || 'General Advertisement',
        contentLength: contentLength || 'Medium',
        adType: adType || 'Complete Advertisement',
        generatedContent,
        editedContent: editedContent || {},
      });

      res.status(201).json({
        success: true,
        message: 'Advertisement saved to history successfully.',
        ad,
      });
    } catch (err: any) {
      console.error('Save ad error:', err);
      res.status(500).json({ success: false, error: 'Failed to save advertisement.' });
    }
  }

  /**
   * Stage 9: Get user advertisement history
   */
  static async getHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const ads = AdvertisementModel.find({ userId });

      res.status(200).json({
        success: true,
        count: ads.length,
        ads,
      });
    } catch (err: any) {
      console.error('Get ad history error:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve advertisement history.' });
    }
  }

  /**
   * Stage 9: Get single saved ad by ID
   */
  static async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const ad = AdvertisementModel.findById(id);
      if (!ad) {
        res.status(404).json({ success: false, error: 'Advertisement not found.' });
        return;
      }

      // Ownership authorization check
      if (ad.userId !== userId) {
        res.status(403).json({ success: false, error: 'Access denied: You do not own this advertisement.' });
        return;
      }

      res.status(200).json({
        success: true,
        ad,
      });
    } catch (err: any) {
      console.error('Get ad detail error:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve advertisement.' });
    }
  }

  /**
   * Stage 9: Update saved advertisement (edited content)
   */
  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { editedContent, tone, platform } = req.body;

      const ad = AdvertisementModel.findById(id);
      if (!ad) {
        res.status(404).json({ success: false, error: 'Advertisement not found.' });
        return;
      }

      // Ownership authorization check
      if (ad.userId !== userId) {
        res.status(403).json({ success: false, error: 'Access denied: You do not have permission to edit this advertisement.' });
        return;
      }

      const updated = AdvertisementModel.findByIdAndUpdate(id, {
        ...(editedContent && { editedContent }),
        ...(tone && { tone }),
        ...(platform && { platform }),
      });

      res.status(200).json({
        success: true,
        message: 'Advertisement updated successfully.',
        ad: updated,
      });
    } catch (err: any) {
      console.error('Update ad error:', err);
      res.status(500).json({ success: false, error: 'Failed to update advertisement.' });
    }
  }

  /**
   * Stage 9: Delete saved advertisement
   */
  static async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const ad = AdvertisementModel.findById(id);
      if (!ad) {
        res.status(404).json({ success: false, error: 'Advertisement not found.' });
        return;
      }

      // Ownership authorization check
      if (ad.userId !== userId) {
        res.status(403).json({ success: false, error: 'Access denied: You do not have permission to delete this advertisement.' });
        return;
      }

      AdvertisementModel.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'Advertisement deleted from history.',
      });
    } catch (err: any) {
      console.error('Delete ad error:', err);
      res.status(500).json({ success: false, error: 'Failed to delete advertisement.' });
    }
  }

  /**
   * Stage 4: Real dashboard statistics
   */
  static async getDashboardStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const userAds = AdvertisementModel.find({ userId });
      const userProducts = ProductModel.find({ userId });

      // Recent 5 advertisements
      const recentAds = userAds.slice(0, 5);

      res.status(200).json({
        success: true,
        stats: {
          totalAds: userAds.length,
          totalProducts: userProducts.length,
          recentAds,
        },
      });
    } catch (err: any) {
      console.error('Dashboard stats error:', err);
      res.status(500).json({ success: false, error: 'Failed to load dashboard statistics.' });
    }
  }
}
