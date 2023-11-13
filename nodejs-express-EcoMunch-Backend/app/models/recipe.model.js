module.exports = (sequelize, Sequelize) => {
    const Recipe = sequelize.define("recipe", {
      image: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      ingredientsWithMeasurements : {
        type: Sequelize.STRING
      },
      instructions : {
        type: Sequelize.STRING
      },
    });
  
    return Recipe;
  };