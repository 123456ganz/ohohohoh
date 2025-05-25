module.exports = [
  "function createToken(string memory name, string memory symbol, string memory image_uri, string memory description, string memory website, string memory twitter, string memory telegram, string memory discord, uint8 dexIndex) external payable returns (address tokenAddress)",
  "function updateTokenMetadata(address tokenAddress, string memory newDescription, string memory newWebsite, string memory newTwitter, string memory newTelegram, string memory newDiscord, string memory newImageUri) external",
  "function buyTokens(address token, uint256 userBlockNumber, bytes memory signature) external payable",
  "function sellTokens(address token, uint256 tokenAmount, uint256 userBlockNumber, bytes memory signature) external",
  "function getLiquidity(address token) public view returns (uint256 hypeReserve, uint256 tokenReserve)",
  "function estimateBuy(address token, uint256 hypeAmount) public view returns (uint256)",
  "function estimateSell(address token, uint256 tokenAmount) public view returns (uint256)",
  "function getTokenMetadata(address token) external view returns (tuple(string name, string symbol, string image_uri, string description, string website, string twitter, string telegram, string discord, address creator, uint256 creationTimestamp, uint256 lastUpdated, uint256 startingLiquidity, uint256 currentHypeReserves, uint256 currentTokenReserves, uint256 totalSupply, uint256 currentPrice, uint8 dexIndex))",
  "event TokenCreated(address indexed token, address indexed creator, string name, string symbol, string image_uri, string description, string website, string twitter, string telegram, string discord, uint256 creationTimestamp, uint256 startingLiquidity, uint256 currentHypeReserves, uint256 tokenReserves, uint256 totalSupply, uint256 currentPrice, uint256 initialPurchaseAmount)",
  "event TokensPurchased(address indexed token, address indexed buyer, uint256 hypeIn, uint256 tokensOut, uint256 price, uint256 timestamp, uint256 hypeReserves, uint256 tokenReserves, uint256 totalSupply, string name, string symbol)",
  "event TokensSold(address indexed token, address indexed seller, uint256 tokensIn, uint256 hypeOut, uint256 price, uint256 timestamp, uint256 hypeReserves, uint256 tokenReserves, uint256 totalSupply, string name, string symbol)",
  "event TokenMetadataUpdated(address indexed token, address indexed creator, string name, string symbol, string image_uri, string description, string website, string twitter, string telegram, string discord, uint256 creationTimestamp, uint256 lastUpdated, uint256 startingLiquidity, uint256 currentHypeReserves, uint256 tokenReserves, uint256 totalSupply, uint256 currentPrice)",
  "event TokensBurned(address indexed token, uint256 amount)",
  "event TokenBonded(address indexed token)",
  "event TokenFrozen(address indexed token)"
]
