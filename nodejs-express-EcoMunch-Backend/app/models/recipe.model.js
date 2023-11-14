module.exports = (sequelize, Sequelize) => {
    const Recipe = sequelize.define("recipes", {
      image: {
        type: Sequelize.TEXT('long')
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