import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
import { PrismaService } from '../../prisma/prisma.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';

describe('WishlistService', () => {
  let service: WishlistService;

  const mockPrisma = {
    wishlistItem: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    product: {
      findUnique: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWishlist', () => {
    it('should return mapped wishlist items', async () => {
      const mockItems = [
        {
          id: 'wish-1',
          productId: 'prod-1',
          createdAt: new Date(),
          product: {
            name: 'Test Product',
            slug: 'test-product',
            basePriceCents: 1000,
            currency: 'INR',
            images: [{ url: 'image-url' }],
          },
        },
      ];
      mockPrisma.wishlistItem.findMany.mockResolvedValue(mockItems);

      const result = await service.getWishlist('user-1');

      expect(result.data).toHaveLength(1);
      expect(result.data[0].productName).toBe('Test Product');
      expect(result.data[0].imageUrl).toBe('image-url');
    });
  });

  describe('addToWishlist', () => {
    it('should throw NotFoundException if product does not exist', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);
      await expect(service.addToWishlist('user-1', 'invalid-prod')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should add item and return getWishlist if not already in wishlist', async () => {
      const mockProduct = { id: 'prod-1', name: 'Test Product' };
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);
      mockPrisma.wishlistItem.findUnique.mockResolvedValue(null);
      mockPrisma.wishlistItem.create.mockResolvedValue({ id: 'wish-1' });
      mockPrisma.wishlistItem.findMany.mockResolvedValue([]);

      await service.addToWishlist('user-1', 'prod-1');

      expect(mockPrisma.wishlistItem.create).toHaveBeenCalledWith({
        data: { userId: 'user-1', productId: 'prod-1' },
      });
    });

    it('should not call create if already in wishlist', async () => {
      const mockProduct = { id: 'prod-1', name: 'Test Product' };
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);
      mockPrisma.wishlistItem.findUnique.mockResolvedValue({ id: 'wish-1' });
      mockPrisma.wishlistItem.create.mockClear();
      mockPrisma.wishlistItem.findMany.mockResolvedValue([]);

      await service.addToWishlist('user-1', 'prod-1');

      expect(mockPrisma.wishlistItem.create).not.toHaveBeenCalled();
    });
  });

  describe('removeFromWishlist', () => {
    it('should delete item if it exists in wishlist', async () => {
      mockPrisma.wishlistItem.findUnique.mockResolvedValue({ id: 'wish-1' });
      mockPrisma.wishlistItem.delete.mockResolvedValue({ id: 'wish-1' });
      mockPrisma.wishlistItem.findMany.mockResolvedValue([]);

      await service.removeFromWishlist('user-1', 'prod-1');

      expect(mockPrisma.wishlistItem.delete).toHaveBeenCalledWith({
        where: { id: 'wish-1' },
      });
    });

    it('should not call delete if item does not exist in wishlist', async () => {
      mockPrisma.wishlistItem.findUnique.mockResolvedValue(null);
      mockPrisma.wishlistItem.delete.mockClear();
      mockPrisma.wishlistItem.findMany.mockResolvedValue([]);

      await service.removeFromWishlist('user-1', 'prod-1');

      expect(mockPrisma.wishlistItem.delete).not.toHaveBeenCalled();
    });
  });
});
