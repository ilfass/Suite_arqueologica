import { Request, Response } from 'express';
import { ArchaeologicalSiteController } from '../../controllers/archaeologicalSiteController';
import { ArchaeologicalSiteService } from '../../services/archaeologicalSiteService';

// Mock del servicio
jest.mock('../../services/archaeologicalSiteService');

describe('ArchaeologicalSiteController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      params: {},
      body: {},
      query: {},
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('createSite', () => {
    it('should create a site successfully', async () => {
      const mockSite = {
        id: '123',
        name: 'Test Site',
        description: 'Test Description',
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          address: 'Test Address',
        },
        period: 'Ancient',
        status: 'active',
        createdBy: 'user123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = {
        name: 'Test Site',
        description: 'Test Description',
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          address: 'Test Address',
        },
        period: 'Ancient',
        status: 'active',
      };

      (ArchaeologicalSiteService.createSite as jest.Mock).mockResolvedValue(mockSite);

      await ArchaeologicalSiteController.createSite(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(ArchaeologicalSiteService.createSite).toHaveBeenCalledWith({
        ...mockRequest.body,
        createdBy: undefined, // Will be set by auth middleware
      });
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockSite,
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Creation failed');
      (ArchaeologicalSiteService.createSite as jest.Mock).mockRejectedValue(error);

      await ArchaeologicalSiteController.createSite(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getSiteById', () => {
    it('should get a site by id successfully', async () => {
      const mockSite = {
        id: '123',
        name: 'Test Site',
        description: 'Test Description',
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          address: 'Test Address',
        },
        period: 'Ancient',
        status: 'active',
        createdBy: 'user123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: '123' };
      (ArchaeologicalSiteService.getSiteById as jest.Mock).mockResolvedValue(mockSite);

      await ArchaeologicalSiteController.getSiteById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(ArchaeologicalSiteService.getSiteById).toHaveBeenCalledWith('123');
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockSite,
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Site not found');
      mockRequest.params = { id: '123' };
      (ArchaeologicalSiteService.getSiteById as jest.Mock).mockRejectedValue(error);

      await ArchaeologicalSiteController.getSiteById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllSites', () => {
    it('should list sites with filters successfully', async () => {
      const mockSites = [
        {
          id: '123',
          name: 'Test Site 1',
          status: 'active',
        },
        {
          id: '456',
          name: 'Test Site 2',
          status: 'active',
        },
      ];

      mockRequest.query = { status: 'active' };
      (ArchaeologicalSiteService.getAllSites as jest.Mock).mockResolvedValue({ sites: mockSites, total: mockSites.length });

      await ArchaeologicalSiteController.getAllSites(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(ArchaeologicalSiteService.getAllSites).toHaveBeenCalledWith({ status: 'active' });
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockSites,
      });
    });

    it('should handle errors', async () => {
      const error = new Error('List failed');
      (ArchaeologicalSiteService.getAllSites as jest.Mock).mockRejectedValue(error);

      await ArchaeologicalSiteController.getAllSites(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
}); 