// ============================================================
// Automated Test Suite for Product Data-Access Service & Fallbacks
// Verifies pagination, category filtering, search, sorting, and slugs
// ============================================================

import assert from 'node:assert';

console.log('🧪 Starting Product Service & Database Query Layer Test Suite...\n');

async function runTests() {
  const {
    getProducts,
    getProductBySlug,
    getFeaturedProducts,
    getRelatedProducts,
    getCategories,
    getBestsellers,
    getNewArrivals,
    getCategoryProductCounts,
    formatINR,
  } = await import('../src/services/productService.ts');

  // Test 1: Helper Formatter
  console.log('Test 1: Price formatter (formatINR)...');
  assert.strictEqual(formatINR(18500), '₹18,500');
  assert.strictEqual(formatINR(24999), '₹24,999');
  console.log('✅ Price formatting verified.');

  // Test 2: Default Paginated Products Query
  console.log('Test 2: getProducts() default pagination...');
  const resDefault = await getProducts({ page: 1, pageSize: 6 });
  assert.strictEqual(resDefault.page, 1);
  assert.strictEqual(resDefault.pageSize, 6);
  assert.strictEqual(resDefault.data.length, 6);
  assert.ok(resDefault.totalCount >= 19);
  assert.strictEqual(resDefault.totalPages, Math.ceil(resDefault.totalCount / 6));
  console.log(`✅ Default pagination returned ${resDefault.data.length} of ${resDefault.totalCount} products.`);

  // Test 3: Category Filtering
  console.log('Test 3: getProducts({ categoryId: "sculptures-idols" })...');
  const resCat = await getProducts({ categoryId: 'sculptures-idols', pageSize: 20 });
  assert.ok(resCat.data.length > 0);
  assert.ok(resCat.data.every((p) => p.collectionId === 'sculptures-idols'));
  console.log(`✅ Category filter returned ${resCat.data.length} sculptures & idols.`);

  // Test 4: Price Sorting (Ascending & Descending)
  console.log('Test 4: Sorting by price...');
  const resAsc = await getProducts({ sortBy: 'price_asc', pageSize: 20 });
  for (let i = 0; i < resAsc.data.length - 1; i++) {
    assert.ok(
      (resAsc.data[i].price || 0) <= (resAsc.data[i + 1].price || 0),
      'Ascending sort order violated'
    );
  }
  const resDesc = await getProducts({ sortBy: 'price_desc', pageSize: 20 });
  for (let i = 0; i < resDesc.data.length - 1; i++) {
    assert.ok(
      (resDesc.data[i].price || 0) >= (resDesc.data[i + 1].price || 0),
      'Descending sort order violated'
    );
  }
  console.log('✅ Ascending and descending price sorting verified.');

  // Test 5: Search Query
  console.log('Test 5: Searching products by name/description...');
  const resSearch = await getProducts({ searchQuery: 'Nataraja' });
  assert.ok(resSearch.data.length >= 1);
  assert.ok(
    resSearch.data.some((p) => p.name.includes('Nataraja') || p.shortDescription.includes('Nataraja'))
  );
  console.log(`✅ Search for "Nataraja" returned ${resSearch.data.length} matching piece(s).`);

  // Test 6: Get Product by Slug
  console.log('Test 6: getProductBySlug("nataraja-lord-of-cosmic-dance")...');
  const pSlug = await getProductBySlug('nataraja-lord-of-cosmic-dance');
  assert.ok(pSlug !== null);
  assert.strictEqual(pSlug?.slug, 'nataraja-lord-of-cosmic-dance');
  assert.strictEqual(pSlug?.sku, 'TMR-SC-001');
  assert.ok(pSlug?.images.length > 0);
  assert.ok(pSlug?.material.includes('black-metal'));

  const pNotFound = await getProductBySlug('non-existent-piece-xyz');
  assert.strictEqual(pNotFound, null);
  console.log('✅ getProductBySlug returned valid product and handled non-existent slug.');

  // Test 7: Featured & Related Products
  console.log('Test 7: Featured and Related products...');
  const featured = await getFeaturedProducts(4);
  assert.strictEqual(featured.length, 4);
  assert.ok(featured.every((p) => p.isFeatured));

  const related = await getRelatedProducts('sc-001', 'sculptures-idols', 3);
  assert.strictEqual(related.length, 3);
  assert.ok(related.every((p) => p.id !== 'sc-001'));
  console.log('✅ Featured and Related queries verified.');

  // Test 8: Get Categories
  console.log('Test 8: getCategories()...');
  const categories = await getCategories();
  assert.strictEqual(categories.length, 5);
  console.log(`✅ Fetched ${categories.length} active categories.`);

  // Test 9: Search by SKU
  console.log('Test 9: Searching products by SKU...');
  const skuSearchResult = await getProducts({ searchQuery: 'TMR-SC-001' });
  assert.strictEqual(skuSearchResult.data.length, 1);
  assert.strictEqual(skuSearchResult.data[0].sku, 'TMR-SC-001');
  console.log('✅ SKU search verified (found TMR-SC-001).');

  // Test 10: Verified Bestsellers (only genuine is_bestseller = true)
  console.log('Test 10: getBestsellers()...');
  const bestsellers = await getBestsellers(4);
  assert.ok(bestsellers.length > 0);
  assert.ok(bestsellers.every((p) => p.isBestseller === true));
  console.log(`✅ Verified bestsellers query returned ${bestsellers.length} genuine bestseller items.`);

  // Test 11: New Arrivals
  console.log('Test 11: getNewArrivals()...');
  const newArrivals = await getNewArrivals(4);
  assert.ok(newArrivals.length > 0);
  assert.ok(newArrivals.every((p) => p.isNew === true));
  console.log(`✅ New arrivals query returned ${newArrivals.length} pieces.`);

  // Test 12: Category counts
  console.log('Test 12: getCategoryProductCounts()...');
  const counts = await getCategoryProductCounts();
  assert.ok(counts.all > 0);
  assert.ok(counts['sculptures-idols'] > 0);
  console.log(`✅ Category counts computed accurately (total: ${counts.all}).`);

  console.log('\n🎉 ALL 12 PRODUCT SERVICE TESTS PASSED SUCCESSFULLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
