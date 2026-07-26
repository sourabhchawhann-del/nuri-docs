# Nuri Product Documentation

## Version 1.0 - July 2026

## Purpose

This document provides comprehensive guidelines for Nuri's product portfolio, naming conventions, catalog structure, quality standards, and operational requirements. It serves as the authoritative reference for product development, inventory management, and customer-facing product information.

## Product Overview

### Current Product Categories:
1. **Korean Stickers** (Primary Category)
   - High-quality vinyl stickers with Korean designs
   - Various sizes and themes
   - Durable, removable, reusable

2. **Korean Stationery** (Secondary Category)
   - Premium notebooks, planners, journals
   - Writing instruments, organizers
   - Korean design elements and cultural themes

3. **Cute Accessories** (Growing Category)
   - Phone cases, keychains, wallets
   - Lifestyle accessories inspired by Korean aesthetics
   - Gift-focused product designs

### Product Philosophy:
Nuri products are designed to bring "small things, quiet joy" into everyday life through Korean-inspired aesthetics. Each product combines cultural authenticity with practical functionality, creating meaningful connections between users and their personal spaces.

## Product Naming Convention

### Structure:
**CATEGORY-TYPE-COLLECTION-NUMBER**

### Format Examples:
1. **STKR-DESK-ART-001** (Desk Art Sticker Collection #1)
2. **NTBY-KLEE-101** (Korean Lettering Booklet #101)
3. **KCHA-COVR-AM-001** (Korean Charms Phone Case #1)
4. **JSEN-NBKC-001** (Journal - Simple Black Cover #1)

### Naming Guidelines:
1. **Category Prefix (3-4 letters)**:
   - STKR = Stickers
   - NTBY = Notepads/Books
   - KCHA = Keychains
   - COVR = Covers/Cases
   - JSEN = Journals
   - ACCT = Accessories

2. **Style/Design Prefix**:
   - ART = Art Stickers
   - KLEE = Korean Calligraphy
   - JUNG = Korean Patterns
   - BUDH = Buddhist Motifs
   - FOLK = Folk Art
   - MODN = Modern Design

3. **Collection Number**: Sequential numbering within each category-style combination

### Product Codes:
- **SKU Format**: [PREFIX]-[COLLECTION]-[NUMBER]
- **Example**: STKR-KLEE-101
- **Storage**: Combined with barcode for inventory systems

## Product Categories

### 1. Korean Stickers

#### Subcategories:
1. **Traditional Art (TRA)**
   - Buddhist art, calligraphy, traditional motifs
   - Cultural educational content

2. **Modern Illustration (MOD)**
   - Contemporary Korean artists' work
   - Pop culture references
   - Abstract designs

3. **Pattern & Texture (PAT)**
   - Geometric patterns
   - Textured designs
   - Repeating motifs

4. **Cultural Elements (CUL)**
   - Korean architecture
   - Traditional objects
   - Seasonal themes

### 2. Stationery

#### Categories:
1. **Notebooks & Journals (NTBY)**
   - Hardcover and softcover options
   - Various page counts and sizes
   - Korean-inspired cover designs

2. **Writing Instruments (WRIT)**
   - Pens, pencils, markers
   - Korean fountain pens
   - Calligraphy sets

3. **Organizers & Planning (ORGN)**
   - Planners, calendars
   - Sticky notes, organizers
   - Desk accessories

### 3. Accessories

#### Types:
1. **Phone Cases (PHCO)**
   - Back and folio styles
   - Clear and colored options
   - Korean design themes

2. **Keychains (KEYC)**
   - Metal and acrylic materials
   - Various attachment types
   - Korean cultural symbols

3. **Wallets & Pouches (WAL)**
   - Card holders, money clips
   - Belt loops, lanyard attachments
   - Traditional Korean motifs

## SKU Standard and Product Codes

### SKU Format:
**CAT-STY-COL-NUM**

### Components:
1. **CAT** (3 letters): Product category code
2. **STY** (3 letters): Style/design code
3. **COL** (3 digits): Collection number
4. **NUM** (3 digits): Sequential product number

### Example Product Matrix:
| Category | Style | Collection | Number | Full SKU | Description |
|----------|-------|------------|--------|----------|-------------|
| STKR | KLEE | 101 | 001 | STKR-KLEE-101-001 | Korean Calligraphy Sticker - Cherry Blossom |
| STKR | ART | 101 | 002 | STKR-ART-101-002 | Modern Art Sticker - Hanok silhouette |
| NTBY | KLEE | 101 | 001 | NTBY-KLEE-101-001 | Korean Calligraphy Journal - White Paper |

### Product Database Schema:
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY,
    sku VARCHAR(20) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    style VARCHAR(50) NOT NULL,
    collection VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    korean_name VARCHAR(200),
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    stock_quantity INT DEFAULT 0,
    weight DECIMAL(5, 2),
    dimensions VARCHAR(50),
    material VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sku (sku),
    INDEX idx_category (category),
    INDEX idx_collection (collection),
    INDEX idx_active (is_active)
);
```

## Quality Standards

### 1. Material Standards:
- **Vinyl Stickers**: 80-120 micron thickness, archival quality
- **Paper Products**: 80-120 gsm premium paper, acid-free
- **Plastics**: BPA-free, food-safe materials where applicable
- **Metals**: Recyclable, corrosion-resistant materials

### 2. Production Standards:
- **Printing**: CMYK color reproduction, 300 DPI minimum
- **Packaging**: Eco-friendly materials, minimal waste
- **Quality Control**: 100% inspection for defect rates < 0.1%
- **Testing**: Sustainability and safety certifications

### 3. Design Standards:
- **Color Accuracy**: 99% color reproduction
- **Resolution**: Minimum 300 DPI for all print materials
- **Typography**: Accessibility-compliant fonts
- **Accessibility**: WCAG 2.1 AA compliance for digital products

### 4. Cultural Standards:
- **Authenticity**: All Korean designs must be culturally verified
- **Credit**: All designers and cultural sources properly attributed
- **Respect**: No cultural appropriation or misrepresentation

## Packaging Checklist

### 1. Product Packaging:
- [ ] Eco-friendly materials (recycled kraft paper)
- [ ] Product information in English and Korean
- [ ] Product protection materials
- [ ] Compactor-friendly design
- [ ] Brand presentation

### 2. Order Packaging:
- [ ] Order details clearly visible
- [ ] Branding consistent with company guidelines
- [ ] Minimum size protection materials
- [ ] Return address information
- [ ] Documentation attached

### 3. Shipping Packaging:
- [ ] Sturdy corrugated boxes
- [ ] Protective bubble wrap or foam
- [ ] Product cushioning and separation
- [ ] Water-resistant materials for international shipping
- [ ] Tracking information included

## Product Upload Checklist

### 1. Required Information:
- [ ] Product name (English and Korean if applicable)
- [ ] SKU/code (following naming convention)
- [ ] Category and subcategory
- [ ] Price and currency
- [ ] Stock quantity
- [ ] Product description
- [ ] Detailed features
- [ ] Dimensions and weight
- [ ] Materials and composition
- [ ] Images (front, back, details)
- [ ] Category and tag assignments

### 2. Content Requirements:
- [ ] Product images: 300+ DPI, CMYK color space
- [ ] Alt-text for accessibility
- [ ] SEO-friendly product title
- [ ] Korean cultural context (if applicable)
- [ ] Usage instructions or inspiration
- [ ] Care instructions
- [ ] Product highlights and benefits

### 3. Compliance:
- [ ] Legal compliance (terms, privacy)
- [ ] Intellectual property clearance
- [ ] Cultural authenticity verification
- [ ] Safety and quality certifications
- [ ] Environmental impact assessment

## Product Lifecycle Management

### 1. Development Phase:
1. **Concept Approval**: Review and approval by brand team
2. **Design Validation**: Cultural and aesthetic review
3. **Sample Production**: Quality prototype testing
4. **Feedback Loop**: Customer testing and refinement

### 2. Launch Phase:
1. **Inventory Setup**: Initial stock levels
2. **Digital Entry**: Product catalog upload
3. **Marketing Materials**: Brand-aligned content creation
4. **Retail Training**: Sales team product education

### 3. Maintenance Phase:
1. **Inventory Monitoring**: Stock level alerts
2. **Customer Feedback**: Reviews and ratings analysis
3. **Product Updates**: Design refinements and improvements
4. **Performance Tracking**: Sales and inventory metrics

### 4. Deactivation Phase:
1. **Wind-down Process**: Inventory reduction
2. **Customer Communication**: Clear notifications
3. **Record Keeping**: Historical data preservation
4. **Feedback Collection**: Post-deactivation analysis

## Product Categories Reference

### Category Codes:
| Code | English Name | Korean Name | Description |
|------|--------------|-------------|-------------|
| STKR | Stickers | 스티커 | Vinyl adhesive decals |
| NTBY | Notebooks | 노트 | Writing notebooks and journals |
| PHCO | Phone Cases | 휴대폰 케이스 | Mobile device protection |
| KCHA | Keychains | 열쇠고리 | Key accessories |
| COVR | Covers | 커버 | Book and device covers |
| JSEN | Journals | 저널 | Blank journals and logs |
| ACCT | Accessories | 악세서리 | Lifestyle accessories |
| PLAN | Planners | 플래너 | Scheduling and organization |
| WRIT | Writing | 글쓰기 | Pens and writing instruments |

### Style Codes:
| Code | English Description | Korean Description |
|------|-------------------|-------------------|
| ART | Art Stickers | 예술 스티커 |
| KLEE | Calligraphy | 한글 서예 |
| JUNG | Patterns | 문양 |
| BUDH | Buddhist Motifs | 불교 모티브 |
| FOLK | Folk Art | 민속 공예 |
| MODN | Modern Design | 현대 디자인 |
| TRAD | Traditional | 전통 공예 |

## Analytics and Metrics

### Product Performance Metrics:
1. **Sales Metrics**:
   - Units sold (monthly, quarterly, annual)
   - Revenue generated
   - Average order value by product
   - Sales velocity (units per day/week)

2. **Customer Metrics**:
   - Customer acquisition by product
   - Repeat purchase rates
   - Customer satisfaction scores
   - Net promoter score by product

3. **Inventory Metrics**:
   - Stock turnover rate
   - Days of inventory on hand
   - Stockout frequency
   - Carrying costs

4. **Marketing Metrics**:
   - Conversion rate by product category
   - Click-through rates on product pages
   - Social media engagement by product
   - Email marketing performance

### Reporting Cadence:
- **Daily**: Sales monitoring, inventory alerts
- **Weekly**: Performance trends, inventory optimization
- **Monthly**: Product analysis, pricing review
- **Quarterly**: Strategic product assessment

## Future Product Expansion Guidelines

### New Categories (Future Planning):
1. **Home Decor**
   - Wall art, cushions, rugs
   - Korean traditional and modern designs
   - Quality and cultural standards maintained

2. **Food & Beverage**
   - Korean-themed kitchenware
   - Drinkware, serving accessories
   - Cultural educational content

3. **Beauty & Wellness**
   - Korean skincare and makeup tools
   - Wellness accessories
   - Self-care products

### Expansion Criteria:
- Cultural authenticity and market fit
- Production capacity
- Distribution logistics
- Margin profitability
- Brand alignment

### Success Metrics for New Products:
- First-month sales target (> 100 units)
- Customer satisfaction (> 4.5/5)
- Repeat purchase rate (> 25%)
- Return rate (< 2%)
- Brand alignment rating

## Conclusion

This product documentation provides comprehensive guidelines for maintaining consistency, quality, and cultural authenticity across Nuri's product portfolio. By following these standards, Nuri ensures that every product reflects the brand's commitment to bringing "small things, quiet joy" through Korean-inspired design.

The systematic approach to product management, from naming conventions to quality standards, supports Nuri's growth trajectory while maintaining the authentic cultural foundation that distinguishes the brand in the global market.

**Last Updated**: July 14, 2026
**Next Review**: Q4 2026
**Version**: 1.0