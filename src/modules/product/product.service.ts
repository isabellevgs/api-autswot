import { ProductRepository } from './product.repository.js';
import { NotFoundError } from '../../utils/errors.js';
import type { CreateProductInput, UpdateProductInput } from './product.schemas.js';

/**
 * Service de Product
 * Contém a lógica de negócio relacionada a produtos
 * 
 * NOTA: Este service será implementado quando o modelo Product
 * for adicionado ao schema Prisma
 */
export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  // TODO: Implementar métodos quando o modelo Product existir
  // async getProductById(id: string) { ... }
  // async listProducts(page: number, limit: number) { ... }
  // async createProduct(data: CreateProductInput) { ... }
  // async updateProduct(id: string, data: UpdateProductInput) { ... }
  // async deleteProduct(id: string) { ... }
}

