/**
 * Cash Flow CRUD Test Script
 * 
 * This script tests all the cash flow server actions to ensure they work correctly.
 * Run this in the browser console on a property detail page to test the functionality.
 */

// Test data
const testCashFlow = {
  amount: 1500,
  transaction_type: "RENT",
  description: "Monthly rent payment - Test Entry",
  debit_credit: "CREDIT",
  property_id: "your-property-id-here", // Replace with actual property ID
  user_id: "your-user-id-here", // Replace with actual user ID
};

/**
 * Test the complete CRUD flow
 */
async function testCashFlowCRUD() {
  console.log("🧪 Starting Cash Flow CRUD Tests...");
  
  try {
    // Test 1: Add Cash Flow
    console.log("\n1️⃣ Testing ADD cash flow...");
    const formData = new FormData();
    Object.entries(testCashFlow).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    
    const addResult = await addCashFlow(formData);
    console.log("Add Result:", addResult);
    
    if (!addResult.success) {
      console.error("❌ ADD test failed:", addResult.error);
      return;
    }
    
    const createdCashFlow = addResult.data;
    console.log("✅ ADD test passed - Created cash flow:", createdCashFlow);
    
    // Test 2: Fetch by ID
    console.log("\n2️⃣ Testing FETCH by ID...");
    const fetchResult = await getCashFlowById(createdCashFlow.id);
    console.log("Fetch Result:", fetchResult);
    
    if (!fetchResult.success) {
      console.error("❌ FETCH test failed:", fetchResult.error);
      return;
    }
    
    console.log("✅ FETCH test passed - Retrieved cash flow:", fetchResult.data);
    
    // Test 3: Update Cash Flow
    console.log("\n3️⃣ Testing UPDATE cash flow...");
    const updates = {
      amount: 1750,
      description: "Updated monthly rent payment - Test Entry",
    };
    
    const updateResult = await updateCashFlow(createdCashFlow.id, updates);
    console.log("Update Result:", updateResult);
    
    if (!updateResult.success) {
      console.error("❌ UPDATE test failed:", updateResult.error);
      return;
    }
    
    console.log("✅ UPDATE test passed - Updated cash flow:", updateResult.data);
    
    // Test 4: Fetch All for Property
    console.log("\n4️⃣ Testing FETCH ALL for property...");
    const fetchAllResult = await fetchCashFlows(testCashFlow.property_id);
    console.log("Fetch All Result:", fetchAllResult);
    
    if (!fetchAllResult || fetchAllResult.length === 0) {
      console.warn("⚠️ FETCH ALL returned no results (might be expected)");
    } else {
      console.log("✅ FETCH ALL test passed - Retrieved cash flows:", fetchAllResult);
    }
    
    // Test 5: Delete Cash Flow
    console.log("\n5️⃣ Testing DELETE cash flow...");
    const deleteResult = await deleteCashFlow(createdCashFlow.id);
    console.log("Delete Result:", deleteResult);
    
    if (!deleteResult.success) {
      console.error("❌ DELETE test failed:", deleteResult.error);
      return;
    }
    
    console.log("✅ DELETE test passed");
    
    // Test 6: Verify Deletion
    console.log("\n6️⃣ Testing FETCH after DELETE (should fail)...");
    const fetchAfterDeleteResult = await getCashFlowById(createdCashFlow.id);
    console.log("Fetch After Delete Result:", fetchAfterDeleteResult);
    
    if (fetchAfterDeleteResult.success) {
      console.error("❌ DELETE verification failed - Cash flow still exists");
    } else {
      console.log("✅ DELETE verification passed - Cash flow no longer exists");
    }
    
    console.log("\n🎉 All CRUD tests completed successfully!");
    
  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }
}

/**
 * Test form validation
 */
async function testValidation() {
  console.log("\n🧪 Testing Form Validation...");
  
  try {
    // Test invalid amount
    console.log("\n1️⃣ Testing invalid amount (negative)...");
    const invalidAmountData = new FormData();
    invalidAmountData.append("amount", "-100");
    invalidAmountData.append("transaction_type", "RENT");
    invalidAmountData.append("description", "Test");
    invalidAmountData.append("debit_credit", "CREDIT");
    invalidAmountData.append("property_id", testCashFlow.property_id);
    invalidAmountData.append("user_id", testCashFlow.user_id);
    
    const invalidAmountResult = await addCashFlow(invalidAmountData);
    console.log("Invalid Amount Result:", invalidAmountResult);
    
    if (invalidAmountResult.success) {
      console.error("❌ Validation test failed - Should reject negative amounts");
    } else {
      console.log("✅ Validation test passed - Correctly rejected negative amount");
    }
    
    // Test missing required fields
    console.log("\n2️⃣ Testing missing required fields...");
    const missingFieldsData = new FormData();
    missingFieldsData.append("amount", "100");
    // Missing transaction_type, description, etc.
    
    const missingFieldsResult = await addCashFlow(missingFieldsData);
    console.log("Missing Fields Result:", missingFieldsResult);
    
    if (missingFieldsResult.success) {
      console.error("❌ Validation test failed - Should reject missing fields");
    } else {
      console.log("✅ Validation test passed - Correctly rejected missing fields");
    }
    
    console.log("\n🎉 All validation tests completed!");
    
  } catch (error) {
    console.error("❌ Validation test failed with error:", error);
  }
}

/**
 * Instructions for running tests
 */
console.log(`
📋 Cash Flow CRUD Test Instructions:

1. Open the browser console on a property detail page
2. Update the testCashFlow object with valid property_id and user_id
3. Run: testCashFlowCRUD()
4. Run: testValidation()
5. Check the console output for test results

⚠️ Make sure to update the property_id and user_id in the testCashFlow object before running tests!

Available test functions:
- testCashFlowCRUD() - Tests complete CRUD operations
- testValidation() - Tests form validation
`);

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testCashFlowCRUD,
    testValidation,
    testCashFlow
  };
}
