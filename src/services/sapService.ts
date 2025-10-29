// SAP/ERP Integration Mock Service
// Simulates integration with enterprise resource planning systems

export interface WorkOrder {
  id: string;
  orderNumber: string;
  productCode: string;
  productName: string;
  quantity: number;
  plannedStartTime: Date;
  plannedEndTime: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  lineId: string;
  lineName: string;
  completedQuantity: number;
  defectQuantity: number;
}

export interface Material {
  id: string;
  materialCode: string;
  materialName: string;
  category: 'raw-material' | 'component' | 'packaging' | 'finished-good';
  currentStock: number;
  unit: string;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  costPerUnit: number;
  location: string;
  lastUpdate: Date;
}

export interface MaterialMovement {
  id: string;
  materialCode: string;
  materialName: string;
  movementType: 'inbound' | 'outbound' | 'transfer';
  quantity: number;
  unit: string;
  fromLocation: string;
  toLocation: string;
  workOrderId?: string;
  timestamp: Date;
  documentNumber: string;
}

export interface SAPConnectionStatus {
  connected: boolean;
  lastSync: Date;
  systemVersion: string;
  latency: number; // ms
  errorCount: number;
  dataQuality: number; // 0-100
}

class SAPService {
  private mockWorkOrders: WorkOrder[] = [];
  private mockMaterials: Material[] = [];
  private mockMovements: MaterialMovement[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize work orders
    const now = new Date();
    this.mockWorkOrders = [
      {
        id: 'WO-2024-001',
        orderNumber: '4500123456',
        productCode: 'AF-500X',
        productName: 'Airfryer 500X Black',
        quantity: 500,
        plannedStartTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        plannedEndTime: new Date(now.getTime() + 4 * 60 * 60 * 1000),
        actualStartTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        status: 'in-progress',
        priority: 'high',
        lineId: 'LINE-A',
        lineName: 'Production Line A',
        completedQuantity: 312,
        defectQuantity: 8,
      },
      {
        id: 'WO-2024-002',
        orderNumber: '4500123457',
        productCode: 'KB-300S',
        productName: 'Kettle Brilliant 300S Steel',
        quantity: 800,
        plannedStartTime: new Date(now.getTime() + 1 * 60 * 60 * 1000),
        plannedEndTime: new Date(now.getTime() + 8 * 60 * 60 * 1000),
        status: 'planned',
        priority: 'normal',
        lineId: 'LINE-B',
        lineName: 'Production Line B',
        completedQuantity: 0,
        defectQuantity: 0,
      },
      {
        id: 'WO-2024-003',
        orderNumber: '4500123458',
        productCode: 'VM-800P',
        productName: 'Vacuum MultiClean 800 Pro',
        quantity: 300,
        plannedStartTime: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        plannedEndTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        actualStartTime: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        actualEndTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        status: 'completed',
        priority: 'normal',
        lineId: 'LINE-A',
        lineName: 'Production Line A',
        completedQuantity: 300,
        defectQuantity: 5,
      },
    ];

    // Initialize materials
    this.mockMaterials = [
      {
        id: 'MAT-001',
        materialCode: '1000456789',
        materialName: 'Heating Element 1500W',
        category: 'component',
        currentStock: 1250,
        unit: 'PC',
        minStock: 500,
        maxStock: 3000,
        reorderPoint: 800,
        costPerUnit: 12.5,
        location: 'WAREHOUSE-A-12',
        lastUpdate: new Date(),
      },
      {
        id: 'MAT-002',
        materialCode: '1000456790',
        materialName: 'Control Board PCB-AF500',
        category: 'component',
        currentStock: 450,
        unit: 'PC',
        minStock: 300,
        maxStock: 1500,
        reorderPoint: 400,
        costPerUnit: 28.75,
        location: 'WAREHOUSE-A-05',
        lastUpdate: new Date(),
      },
      {
        id: 'MAT-003',
        materialCode: '1000456791',
        materialName: 'Packaging Box Type-A',
        category: 'packaging',
        currentStock: 8500,
        unit: 'PC',
        minStock: 2000,
        maxStock: 15000,
        reorderPoint: 3000,
        costPerUnit: 1.2,
        location: 'WAREHOUSE-B-20',
        lastUpdate: new Date(),
      },
      {
        id: 'MAT-004',
        materialCode: '1000456792',
        materialName: 'Stainless Steel Housing',
        category: 'raw-material',
        currentStock: 650,
        unit: 'PC',
        minStock: 400,
        maxStock: 2000,
        reorderPoint: 500,
        costPerUnit: 18.9,
        location: 'WAREHOUSE-A-18',
        lastUpdate: new Date(),
      },
    ];

    // Initialize material movements
    this.mockMovements = [
      {
        id: 'MOV-001',
        materialCode: '1000456789',
        materialName: 'Heating Element 1500W',
        movementType: 'outbound',
        quantity: 312,
        unit: 'PC',
        fromLocation: 'WAREHOUSE-A-12',
        toLocation: 'LINE-A',
        workOrderId: 'WO-2024-001',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        documentNumber: 'GI-2024-0567',
      },
      {
        id: 'MOV-002',
        materialCode: '1000456790',
        materialName: 'Control Board PCB-AF500',
        movementType: 'inbound',
        quantity: 500,
        unit: 'PC',
        fromLocation: 'SUPPLIER-ELEC-01',
        toLocation: 'WAREHOUSE-A-05',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        documentNumber: 'GR-2024-1234',
      },
    ];
  }

  // Get connection status
  getConnectionStatus(): SAPConnectionStatus {
    return {
      connected: true,
      lastSync: new Date(),
      systemVersion: 'SAP S/4HANA 2023',
      latency: Math.floor(Math.random() * 50) + 30, // 30-80ms
      errorCount: Math.floor(Math.random() * 3),
      dataQuality: Math.floor(Math.random() * 5) + 95, // 95-100%
    };
  }

  // Get work orders
  getWorkOrders(filter?: {
    status?: WorkOrder['status'];
    lineId?: string;
    priority?: WorkOrder['priority'];
  }): WorkOrder[] {
    let orders = [...this.mockWorkOrders];

    if (filter) {
      if (filter.status) {
        orders = orders.filter((o) => o.status === filter.status);
      }
      if (filter.lineId) {
        orders = orders.filter((o) => o.lineId === filter.lineId);
      }
      if (filter.priority) {
        orders = orders.filter((o) => o.priority === filter.priority);
      }
    }

    return orders.sort((a, b) => b.plannedStartTime.getTime() - a.plannedStartTime.getTime());
  }

  // Get single work order
  getWorkOrder(id: string): WorkOrder | undefined {
    return this.mockWorkOrders.find((o) => o.id === id);
  }

  // Update work order status
  updateWorkOrderStatus(
    id: string,
    status: WorkOrder['status'],
    completedQuantity?: number
  ): boolean {
    const order = this.mockWorkOrders.find((o) => o.id === id);
    if (!order) return false;

    order.status = status;
    if (completedQuantity !== undefined) {
      order.completedQuantity = completedQuantity;
    }

    if (status === 'in-progress' && !order.actualStartTime) {
      order.actualStartTime = new Date();
    }

    if (status === 'completed') {
      order.actualEndTime = new Date();
      order.completedQuantity = order.quantity - order.defectQuantity;
    }

    return true;
  }

  // Get materials
  getMaterials(category?: Material['category']): Material[] {
    if (category) {
      return this.mockMaterials.filter((m) => m.category === category);
    }
    return [...this.mockMaterials];
  }

  // Get materials below reorder point
  getMaterialsNeedingReorder(): Material[] {
    return this.mockMaterials.filter((m) => m.currentStock <= m.reorderPoint);
  }

  // Update material stock
  updateMaterialStock(
    materialCode: string,
    quantity: number,
    movementType: MaterialMovement['movementType']
  ): boolean {
    const material = this.mockMaterials.find((m) => m.materialCode === materialCode);
    if (!material) return false;

    if (movementType === 'outbound' || movementType === 'transfer') {
      material.currentStock -= quantity;
    } else {
      material.currentStock += quantity;
    }

    material.lastUpdate = new Date();
    return true;
  }

  // Get material movements
  getMaterialMovements(filter?: {
    materialCode?: string;
    movementType?: MaterialMovement['movementType'];
    workOrderId?: string;
  }): MaterialMovement[] {
    let movements = [...this.mockMovements];

    if (filter) {
      if (filter.materialCode) {
        movements = movements.filter((m) => m.materialCode === filter.materialCode);
      }
      if (filter.movementType) {
        movements = movements.filter((m) => m.movementType === filter.movementType);
      }
      if (filter.workOrderId) {
        movements = movements.filter((m) => m.workOrderId === filter.workOrderId);
      }
    }

    return movements.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Create material movement
  createMaterialMovement(movement: Omit<MaterialMovement, 'id' | 'timestamp'>): MaterialMovement {
    const newMovement: MaterialMovement = {
      ...movement,
      id: `MOV-${String(this.mockMovements.length + 1).padStart(3, '0')}`,
      timestamp: new Date(),
    };

    this.mockMovements.unshift(newMovement);
    this.updateMaterialStock(movement.materialCode, movement.quantity, movement.movementType);

    return newMovement;
  }

  // Get inventory value
  getTotalInventoryValue(): number {
    return this.mockMaterials.reduce((sum, m) => sum + m.currentStock * m.costPerUnit, 0);
  }

  // Get materials for work order (BOM - Bill of Materials)
  getMaterialsForWorkOrder(_workOrderId: string): Material[] {
    // Simplified: return random materials
    return this.mockMaterials.slice(0, 3);
  }
}

export const sapService = new SAPService();
