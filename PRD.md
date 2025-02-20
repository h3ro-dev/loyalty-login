# Product Requirements Document (PRD)

## Title: Loyalty Reward Voucher Generation System

### Overview
Our system is designed to reward users with loyalty reward vouchers based on their weighted ownership in our legacy projects. Each voucher reflects the aggregated holdings of a user, taken at a specific cutoff block. The user signs up to receive the voucher, adds one or more wallet addresses, and updates wallet details such as nicknames. Behind the scenes, live smart contract data (e.g., balances) is fetched directly from the blockchain to compute these weighted holdings.

### User Journey
1. **User Sign-Up and Wallet Management:**
   - The user signs up because they want to receive a loyalty reward voucher that represents their weighted ownership in our legacy projects.
   - Within the app, in the Wallets page, the user can add wallet addresses, update wallet balances, and change wallet nicknames.

2. **Self-Verification & Testing (BGLD Testing Page):**
   - The BGLD Testing page is repurposed as a testing ground where the user (or an admin) can input a wallet address and select a contract type.
   - The page calls live smart contract APIs to verify that each wallet address is pulling the correct data. This process encourages self-verification and places responsibility on the user.

3. **Back-Office Voucher Generation Process:**
   - Separately, an admin/back-office tool will allow selection of a user from Supabase (via email/account). This tool will scan all wallets associated with that user.
   - The system then queries live smart contract data for each wallet at a designated cutoff block, aggregates the data, applies weighting calculations, and finally stores the result as a "Voucher Draft" for that user.

### Functional Requirements
1. **Authentication & User Selection (Admin/Back-Office):**
   - Provide a secure back-office login that allows selection of a user by email or account ID from Supabase.
   - Display all wallets connected to the selected user.

2. **Testing Ground (BGLD Testing Page):**
   - Repurpose the BGLD Testing page to allow testing of smart contract connections with a dropdown to choose contract type (e.g., BGLD Holdings Test, Other Contract Test).
   - Use a unified testing function for now (as a placeholder) that can be extended later for different smart contracts.

3. **Live Data Aggregation for Voucher Generation:**
   - For every wallet, use libraries (like ethers.js) to call live smart contract functions. Include support for specifying a cutoff block (using the blockTag parameter) to capture historical state if needed.
   - Aggregate and calculate weighted holdings across multiple wallets according to predefined weighting rules.

4. **Voucher Draft Storage:**
   - Save the computed weighted holdings as a "Voucher Draft" in the database along with metadata such as cutoff block, timestamp, and raw data.

5. **Audit & Reporting:**
   - Provide an API/UI endpoint for administrators to review the generated voucher drafts.
   - Enable error handling and logging for all live data fetch operations.

### Non-Functional Requirements
- **Performance:** Queries to smart contracts must be performed quickly, with support for historical queries via blockTag if needed.
- **Reliability:** The voucher generation process should gracefully handle API errors, timeouts, and invalid data.
- **Security:** Secure handling of API keys, especially for blockchain providers, and ensuring sensitive user data is protected.
- **Maintainability:** The code should be modular, with clear separation between the front-end (user/app interface) and back-office/aggregation logic.

### Implementation Notes & Next Steps
1. **Testing Ground Updates:**
   - The current BGLDTesting page (in src/pages/BGLDTesting.tsx) is updated to include a dropdown for contract type and conditionally calls the appropriate testing function. 
   - This page will serve as our primary portal for verifying smart contract interactions during development.

2. **Production Smart Contract Integration:**
   - In production, the app will directly call smart contracts (using ethers.js or similar) to fetch data rather than going through an intermediary server.

3. **Voucher Generation Workflow:**
   - Develop an admin/back-office interface (or API endpoints) for selecting a user, scanning their wallets, aggregating holdings, and storing the Voucher Draft.

4. **History & Change Management:**
   - All changes and decisions will be logged in a history file to keep track of our progress and modifications.
   - Once our conversation exceeds 30 messages, the history will be organized and parsed as needed.

### Final Thought
- The goal is to accurately capture each user's weighted ownership at the cutoff block and generate a voucher that reflects this value. The testing ground is essential to help users and admins verify that smart contract integrations are working correctly before moving to production.

## Change Log

- 2023-10-26: Integrated multi-contract testing functionality in the BGLDTesting page along with support for querying smart contracts at a specific block (blockTag) by updating testBGLDAddress and testOtherAddress functions. Created a new admin Voucher Generation page to aggregate user holdings and generate a Voucher Draft. 