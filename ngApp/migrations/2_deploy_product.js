const product = artifacts.require("Product");

const products = {
    name: "Watch"
}

module.exports = function (deployer) {
  deployer.deploy(product, products.name);
};
