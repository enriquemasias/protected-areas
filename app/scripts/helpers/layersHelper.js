define([
  'text!queries/poverty.psql',
  'text!cartocss/poverty.cartocss',
  'text!queries/housing_spent.psql',
  'text!cartocss/housing_spent.cartocss',
  'text!queries/scolarships_lunch.psql',
  'text!cartocss/scolarships_lunch.cartocss',
  'text!queries/agriculture_contribution.psql',
  'text!cartocss/agriculture_contribution.cartocss'
], function(POVERTY_SQL, POVERTY_CSS, HOUSING_SPENT_PSQL, HOUSING_SPENT_CSS, SCOLARSHIPS_LUNCH_PSQL,
    SCOLARSHIPS_LUNCH_CSS, AGRICULTURE_CONTRIBUTION_PSQL, AGRICULTURE_CONTRIBUTION_CSS) {
  'use strict';

  var layersHelper = {
    poverty: {
      title: 'Poverty Index',
      slug: 'poverty',
      sql: POVERTY_SQL,
      cartocss: POVERTY_CSS,
      legend: true,
      interactivity: 'median_household_income, county'
    },
    'housing-spent': {
      title: 'Income spent on housing',
      slug: 'housing-spent',
      sql: HOUSING_SPENT_PSQL,
      cartocss: HOUSING_SPENT_CSS,
      legend: true
    },
    'scolarships-lunch': {
      title: 'Scolarships Lunch',
      slug: 'scolarships-lunch',
      sql: SCOLARSHIPS_LUNCH_PSQL,
      cartocss: SCOLARSHIPS_LUNCH_CSS,
      legend: true
    },
    'agriculture-contribution': {
      title: 'Agriculture Contribution',
      slug: 'agriculture-contribution',
      sql: AGRICULTURE_CONTRIBUTION_PSQL,
      cartocss: AGRICULTURE_CONTRIBUTION_CSS,
      legend: true
    }
  };

  return layersHelper;
});
