import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { ProductModel } from '../models/Product.js';

export class ProductController {
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { name, category, description, features, benefits, audience, price, offer } = req.body;

      const product = ProductModel.create({
        userId,
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        features: features.trim(),
        benefits: benefits.trim(),
        audience: audience.trim(),
        price: price ? String(price).trim() : undefined,
        offer: offer ? String(offer).trim() : undefined,
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully.',
        product,
      });
    } catch (err: any) {
      console.error('Create product error:', err);
      res.status(500).json({ success: false, error: 'Failed to create product.' });
    }
  }

  static async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const products = ProductModel.find({ userId });
      res.status(200).json({
        success: true,
        count: products.length,
        products,
      });
    } catch (err: any) {
      console.error('Get products error:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve products.' });
    }
  }

  static async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const product = ProductModel.findById(id);
      if (!product) {
        res.status(404).json({ success: false, error: 'Product not found.' });
        return;
      }

      // Ownership authorization check
      if (product.userId !== userId) {
        res.status(403).json({ success: false, error: 'Access denied: You do not own this product.' });
        return;
      }

      res.status(200).json({
        success: true,
        product,
      });
    } catch (err: any) {
      console.error('Get product error:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve product details.' });
    }
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { name, category, description, features, benefits, audience, price, offer } = req.body;

      const product = ProductModel.findById(id);
      if (!product) {
        res.status(404).json({ success: false, error: 'Product not found.' });
        return;
      }

      // Ownership authorization check
      if (product.userId !== userId) {
        res.status(403).json({ success: false, error: 'Access denied: You do not have permission to edit this product.' });
        return;
      }

      const updated = ProductModel.findByIdAndUpdate(id, {
        ...(name && { name: name.trim() }),
        ...(category && { category: category.trim() }),
        ...(description && { description: description.trim() }),
        ...(features && { features: features.trim() }),
        ...(benefits && { benefits: benefits.trim() }),
        ...(audience && { audience: audience.trim() }),
        price: price !== undefined ? String(price).trim() : product.price,
        offer: offer !== undefined ? String(offer).trim() : product.offer,
      });

      res.status(200).json({
        success: true,
        message: 'Product updated successfully.',
        product: updated,
      });
    } catch (err: any) {
      console.error('Update product error:', err);
      res.status(500).json({ success: false, error: 'Failed to update product.' });
    }
  }

  static async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const product = ProductModel.findById(id);
      if (!product) {
        res.status(404).json({ success: false, error: 'Product not found.' });
        return;
      }

      // Ownership authorization check
      if (product.userId !== userId) {
        res.status(403).json({ success: false, error: 'Access denied: You do not have permission to delete this product.' });
        return;
      }

      ProductModel.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully.',
      });
    } catch (err: any) {
      console.error('Delete product error:', err);
      res.status(500).json({ success: false, error: 'Failed to delete product.' });
    }
  }

  static async seedSampleData(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { AdvertisementModel } = await import('../models/Advertisement.js');

      // Sample products to seed
      const sampleProducts = [
        {
          name: 'NovaGlow Smart Lumbar Ergonomic Chair',
          category: 'Office Furniture & Ergonomics',
          description: 'An intelligent office chair with dynamic memory foam posture support, breathable mesh, and adjustable 4D armrests.',
          features: '4D multi-directional armrests, adaptive lumbar spring mechanism, temperature-regulating mesh, 135° recline lock',
          benefits: 'Relieves chronic lower back tension, increases 8-hour workday productivity, promotes natural spinal alignment',
          audience: 'Remote software engineers, designers, executives, long-hour office workers',
          price: '$299.00',
          offer: 'Free shipping + 15% off with code WORKWELL',
        },
        {
          name: 'HydroPeak Titanium Smart Thermos',
          category: 'Health & Fitness',
          description: 'A double-walled titanium vacuum insulated bottle that keeps beverages piping hot for 18h and icy cold for 36h with UV sterilization.',
          features: 'Medical-grade titanium interior, UV-C purifying cap, integrated touch temperature display, leakproof magnetic lid',
          benefits: '99.9% bacteria-free water anytime, zero metallic aftertaste, ultra-lightweight travel endurance',
          audience: 'Outdoor hikers, endurance athletes, gym goers, health-conscious travelers',
          price: '$64.99',
          offer: 'Buy 1 Get 2nd at 30% off',
        },
        {
          name: 'CloudSync AI Project Manager',
          category: 'SaaS & Productivity',
          description: 'Next-generation sprint planning and team orchestration platform powered by automated workflow forecasting.',
          features: 'Real-time burndown chart predictions, automated meeting summary generator, Slack & GitHub integrations, cross-team kanban',
          benefits: 'Cuts sprint planning meetings in half, eliminates missed deadlines, provides clear engineering velocity metrics',
          audience: 'Startup CTOs, product managers, agile scrum masters, engineering teams',
          price: '$12/user/mo',
          offer: '14-day free trial, no credit card required',
        },
        {
          name: 'EcoPouch Plant-Based Dog Treats',
          category: 'Pet Care & Sustainability',
          description: 'All-natural, hypoallergenic baked dog bites made with organic pumpkin and cricket protein inside 100% compostable packaging.',
          features: 'Zero artificial preservatives, grain-free organic pumpkin & sweet potato, compostable soy-ink packaging, vet-formulated',
          benefits: 'Soothes sensitive canine stomachs, supports shiny coat, 80% lower carbon footprint than meat treats',
          audience: 'Eco-conscious dog parents, pet owners dealing with allergies, sustainable lifestyle advocates',
          price: '$14.50',
          offer: 'Subscribe & save 20% on monthly refills',
        },
      ];

      const createdProducts = [];
      for (const sp of sampleProducts) {
        // Only create if user doesn't already have one with the same name
        const existing = ProductModel.findOne({ userId, name: sp.name });
        if (!existing) {
          const prod = ProductModel.create({
            userId,
            ...sp,
          });
          createdProducts.push(prod);
        }
      }

      // Sample ads to seed
      const sampleAds = [
        {
          productName: 'NovaGlow Smart Lumbar Ergonomic Chair',
          tone: 'Modern',
          platform: 'Social Media',
          contentLength: 'Medium',
          adType: 'Complete Advertisement',
          generatedContent: {
            headline: 'Say Goodbye to Back Pain with NovaGlow Smart Lumbar Support',
            shortDescription: 'Built for software engineers and executives who spend 8+ hours at their desks. Features dynamic memory foam posture alignment and adaptive 4D armrests.',
            longDescription: 'Introducing NovaGlow Smart Lumbar Ergonomic Chair starting at $299.00. Tailored for remote workers and creators, this premium chair combines adaptive lumbar springs with temperature-regulating breathable mesh.\n\nKey Highlights:\n• 4D multi-directional armrests & 135° recline lock\n• Dynamic posture-aligning lumbar memory system\n• Breathable high-durability cooling mesh\n\nWhy It Matters:\n• Drastically cuts daily lower back strain and elevates focus throughout long work sprints.\n\nSpecial Offer: Free shipping + 15% off with code WORKWELL.',
            tagline: 'NovaGlow: Ergonomic Perfection for Deep Work.',
            promotionalMessage: 'Limited Offer: Enjoy Free Shipping + 15% off with code WORKWELL on the NovaGlow Ergonomic Chair.',
            callToAction: 'Upgrade Your Workspace Today',
            socialMediaCopy: 'Still hunching over your desk by 3 PM? 💺 Meet NovaGlow Smart Lumbar Chair.\n\n✨ 4D armrests, breathable mesh & adaptive lumbar support\n💡 Relieves back tension so you can power through your day\n💰 Starting at $299 with code WORKWELL for 15% off + Free Shipping!\n\n👉 Tap link in bio to transform your home office! #Ergonomics #HomeOffice #WorkFromHome #DeepWork',
          },
          editedContent: {
            headline: 'Zero Back Pain, Maximum Focus: NovaGlow Ergonomic Chair',
          },
        },
        {
          productName: 'HydroPeak Titanium Smart Thermos',
          tone: 'Creative',
          platform: 'E-commerce',
          contentLength: 'Short',
          adType: 'Product Description',
          generatedContent: {
            headline: 'HydroPeak Titanium Thermos: Pure Water Anywhere You Roam',
            shortDescription: 'Ultralight medical-grade titanium thermos with integrated UV-C purification cap keeping your drink ice cold for 36 hours.',
            longDescription: 'Engineered for endurance hikers and mountain athletes, the HydroPeak Titanium Smart Thermos eliminates bacteria with 99.9% UV-C sterilization. Featuring double-walled vacuum insulation, it maintains hot drinks for 18h and cold for 36h with touch-screen lid temperature display.',
            tagline: 'HydroPeak: Pure Hydration Without Compromise.',
            promotionalMessage: 'Gear Up: Buy 1 HydroPeak Thermos, Get the Second at 30% Off!',
            callToAction: 'Order Your Titanium Thermos Now',
            socialMediaCopy: 'Never question your water source again. 🏔️ HydroPeak Titanium Thermos cleans your water with UV-C in 60 seconds and keeps it frosty for 36h.\n\n🔥 Buy 1, Get 2nd at 30% off today!\n\n#HydroPeak #OutdoorGear #HikingEssentials #Titanium',
          },
          editedContent: {},
        },
      ];

      for (const sa of sampleAds) {
        const existingAd = AdvertisementModel.findOne({ userId, productName: sa.productName });
        if (!existingAd) {
          AdvertisementModel.create({
            userId,
            ...sa,
          });
        }
      }

      res.status(200).json({
        success: true,
        message: 'Sample demo products and advertisements loaded successfully!',
      });
    } catch (err: any) {
      console.error('Seed demo data error:', err);
      res.status(500).json({ success: false, error: 'Failed to seed sample data.' });
    }
  }
}
