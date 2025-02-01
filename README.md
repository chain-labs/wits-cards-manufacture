# WITS Card Manufacturing Portal

This portal allows users to manufacture WITS cards by following a simple process. The application provides an intuitive interface for card selection, token allocation, and proof generation.

## How to Use

### 1. Initial Setup
- Visit the portal website
- Enter the URL where you have hosted the claimCards.json file in the input field
- Make sure the JSON file follows the correct format and structure
- Once entered, click "Download" to fetch existing card data
- You will see a simple interface to select new cards for manufacturing

### 2. Adding Cards
- Use the dropdown menu to select cards you want to manufacture
- Enter the desired quantity for each card
- Click "Add Card" to include it in your manufacturing list
- You can view all selected cards in the table below
- Adjust quantities or remove cards using the + and - buttons in the table

### 3. Manufacturing Process
After selecting your cards, click the "Manufacture" button to begin the process. The manufacturing involves three main steps:

#### a. Allocate Tokens
- Enter your private key when prompted (this should be the private key of an authorized account that has permission to generate card links)
- Only accounts with specific permissions can generate valid card links
- Click "Allocate Tokens" to reserve tokens for your cards
- Wait for confirmation that tokens have been allocated

#### b. Generate Proof 
- Once tokens are allocated, click "Generate Proof"
- The system will create necessary proofs for your cards
- Wait for confirmation that proofs have been generated

#### c. Upload JSON File
- Finally, click "Upload JSON File" to complete the process
- Your browser will download a file named `claimCards.json`

### 4. Final Step
After receiving the claimCards.json file, follow these steps:
After receiving the claimCards.json file, you need to upload it to a file hosting service. Here's an example using Bunny.net:

- Visit your file hosting service (e.g., Bunny.net Dashboard)
- Navigate to your storage section (e.g., in Bunny.net: Storage → wits-cdn)
- Upload the `claimCards.json` file
- Ensure the filename remains exactly as "claimCards.json"

Note: You can use any reliable file hosting service of your choice, such as AWS S3, Google Cloud Storage, or similar platforms.

## Important Notes
- Keep your private key secure and never share it
- Ensure you have selected the correct cards and quantities before starting the manufacturing process
- Make sure to complete all steps in order
- Double-check the filename when uploading to Bunny.net
- Each step must be completed successfully before moving to the next one
## JSON Structure

The `claimCards.json` file must follow this specific structure:

```json
{
    "12345": {  // Chain ID (e.g., Abstract Testnet)
        "data": [
            {
                "cardHash": "0x1234...", // Hash of the card data
                "cardInfo": {
                    "assignedTokenId": 1, // Token ID assigned to this card
                    "uniqueCode": 101, // Unique identifier for the card
                    "rarity": 1, // Card rarity (1=Common, 2=Uncommon, 3=Rare, etc.)
                    "name": "Card Name", // Name of the card
                    "faction": "Faction Name" // Card's faction
                }
            }
            // ... more cards
        ],
        "claimLinks": [
            "0xabcd..." // Generated proof for each card
            // ... more proofs
        ]
    }
    // ... other chain IDs if needed
}
```

### Field Descriptions

- **Chain ID**: Numeric identifier for the blockchain network
- **data**: Array containing card information
    - **cardHash**: Unique hash generated for each card
    - **cardInfo**: Object containing card details
        - **assignedTokenId**: Token identifier on the blockchain
        - **uniqueCode**: Card's unique code in the system
        - **rarity**: Numeric value representing card rarity
        - **name**: Card's display name
        - **faction**: Card's associated faction
- **claimLinks**: Array of cryptographic proofs for card claims

### Notes
- All hashes must be in hexadecimal format
- Token IDs and unique codes must be valid integers
- Names and factions must be strings
- The structure must be valid JSON

## Support
If you encounter any issues or need assistance, please contact the WITS support team.