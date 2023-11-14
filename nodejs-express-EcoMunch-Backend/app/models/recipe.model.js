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
        type: Sequelize.TEXT('long')
      },
      instructions : {
        type: Sequelize.TEXT('long')
      },
    });
  
    return Recipe;
  };