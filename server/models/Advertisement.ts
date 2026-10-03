import { JsonCollection, BaseDoc } from '../utils/storage.js';

export interface IAdContent {
  headline: string;
  shortDescription: string;
  longDescription: string;
  tagline: string;
  promotionalMessage: string;
  callToAction: string;
  socialMediaCopy: string;
}

export interface IAdvertisement extends BaseDoc {
  userId: string;
  productId?: string | null;
  productName: string;
  tone: string;
  platform: string;
  contentLength: string;
  adType: string;
  generatedContent: IAdContent;
  editedContent?: Partial<IAdContent>;
}

export const AdvertisementModel = new JsonCollection<IAdvertisement>('advertisements');
