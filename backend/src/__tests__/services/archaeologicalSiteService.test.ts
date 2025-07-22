import { ArchaeologicalSiteService } from '../../services/archaeologicalSiteService';
import supabase from '../../config/supabase';

// Mock de Supabase
jest.mock('../../config/supabase', () => ({
  from: jest.fn(() => ({
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn(),
    eq: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  })),
}));

describe('ArchaeologicalSiteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSite', () => {
    it('should create a new site successfully', async () => {
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

      (supabase.from('archaeological_sites').insert as jest.Mock).mockResolvedValue({
        data: mockSite,
        error: null,
      });

      const result = await ArchaeologicalSiteService.createSite({
        site_code: 'TEST001',
        name: 'Test Site',
        site_type: 'settlement',
        preservation_status: 'good',
        cultural_period: 'Pre-Columbian',
        location: {
          latitude: 40.7128,
          longitude: -74.006
        }
      }, 'test-user-id');

      expect(result).toEqual(mockSite);
    });

    it('should throw an error if site creation fails', async () => {
      (supabase.from('archaeological_sites').insert as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Creation failed' },
      });

      await expect(
        ArchaeologicalSiteService.createSite({
          site_code: 'TEST001',
          name: 'Test Site',
          site_type: 'settlement',
          preservation_status: 'good',
          cultural_period: 'Pre-Columbian',
          location: {
            latitude: 40.7128,
            longitude: -74.006
          }
        }, 'test-user-id')
      ).rejects.toThrow('Creation failed');
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

      (supabase.from('archaeological_sites').select as jest.Mock).mockResolvedValue({
        data: mockSite,
        error: null,
      });

      const result = await ArchaeologicalSiteService.getSiteById('123');

      expect(result).toEqual(mockSite);
    });

    it('should throw an error if site not found', async () => {
      (supabase.from('archaeological_sites').select as jest.Mock).mockResolvedValue({
        data: null,
        error: null,
      });

      await expect(ArchaeologicalSiteService.getSiteById('123')).rejects.toThrow(
        'Archaeological site not found'
      );
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

      (supabase.from('archaeological_sites').select as jest.Mock).mockResolvedValue({
        data: mockSites,
        error: null,
      });

      const result = await ArchaeologicalSiteService.getAllSites({ status: 'active' });

      expect(result).toEqual({ sites: mockSites, total: mockSites.length });
    });

    it('should return empty array if no sites found', async () => {
      (supabase.from('archaeological_sites').select as jest.Mock).mockResolvedValue({
        data: [],
        error: null,
      });

      const result = await ArchaeologicalSiteService.getAllSites();

      expect(result).toEqual({ sites: [], total: 0 });
    });
  });
}); 