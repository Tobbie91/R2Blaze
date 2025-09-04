export type Product = {
  id: string
  name: string
  slug: string
  brand: string
  strap: 'metal' | 'leather' | 'rubber'
  price: number
  prevPrice?: number
  images: string[]
  description: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'rotary-ss-001',
    name: 'Rotary Stainless Classic',
    slug: 'rotary-stainless-classic',
    brand: 'Tagheuer',
    strap: 'metal',
    price: 185000,
    prevPrice: 215000,
    images: [
      '/images/placeholder1.svg',
      '/images/placeholder2.svg'
    ],
    description: 'Elegant stainless steel with date window and quartz movement.'
  },
  {
    id: 'casio-edifice-201',
    name: 'Casio Edifice Chrono',
    slug: 'casio-edifice-chrono',
    brand: 'Casio',
    strap: 'leather',
    price: 142000,
    images: ['/images/placeholder1.svg'],
    description: 'Sport chronograph with 100m water resistance.'
  },
  {
    id: 'casio-edifice-201',
    name: 'Casio Edifice Chrono',
    slug: 'casio-edifice-chrono',
    brand: 'Naviforce',
    strap: 'leather',
    price: 142000,
    images: ['/images/placeholder1.svg'],
    description: 'Sport chronograph with 100m water resistance.'
  },
  {
    id: 'casio-edifice-201',
    name: 'Casio Edifice Chrono',
    slug: 'casio-edifice-chrono',
    brand: 'Patek',
    strap: 'leather',
    price: 142000,
    images: ['/images/placeholder1.svg'],
    description: 'Sport chronograph with 100m water resistance.'
  },
  {
    id: 'casio-edifice-201',
    name: 'Casio Edifice Chrono',
    slug: 'casio-edifice-chrono',
    brand: 'Classic ',
    strap: 'leather',
    price: 142000,
    images: ['/images/placeholder1.svg'],
    description: 'Sport chronograph with 100m water resistance.'
  },
  {
    id: 'casio-edifice-201',
    name: 'Casio Edifice Chrono',
    slug: 'casio-edifice-chrono',
    brand: 'Petite',
    strap: 'leather',
    price: 142000,
    images: ['/images/placeholder1.svg'],
    description: 'Sport chronograph with 100m water resistance.'
  },
  {
    id: 'casio-edifice-201',
    name: 'Casio Edifice Chrono',
    slug: 'casio-edifice-chrono',
    brand: 'Tissot PRX ',
    strap: 'leather',
    price: 142000,
    images: ['/images/placeholder1.svg'],
    description: 'Sport chronograph with 100m water resistance.'
  },
 
  {
    id: 'casio-edifice-201',
    name: 'Casio Edifice Chrono',
    slug: 'casio-edifice-chrono',
    brand: 'Invicta',
    strap: 'leather',
    price: 142000,
    images: ['/images/placeholder1.svg'],
    description: 'Sport chronograph with 100m water resistance.'
  },

]
