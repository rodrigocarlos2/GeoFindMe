Number.prototype.toReadable = function() {
  return String(this).replace(/(\d)(?=(\d{3})+$)/g, '$1,')
};

(function() {
  var CountryComparer = {
    bindEditCountryTriggerToModal: function() {
      var that = this;
      $('.edit-country-trigger').click(function() {
        that.currentEditingCountryIndex = parseInt(this.dataset.countryIndex);
        var modalTitle = "";
        if (that.currentEditingCountryIndex == 0) {
          modalTitle = "Choose First Country";
        } else {
          modalTitle = "Choose Second Country";
        }
        $('#edit-country h4').html(modalTitle);
        $('#edit-country').modal('open');
      });
    },
    bindEditCountryModalLinks: function() {
      var that = this;
      $('#edit-country a.collection-item').click(function() {
        var country = that.fetchCountryByCode(this.dataset.countryCode);
        that.selectedCountries[that.currentEditingCountryIndex] = country;
        $('#edit-country').modal('close');
        that.renderCountry(that.currentEditingCountryIndex);
      });
    },
    bindEditCountrySearch: function() {
      $('input#country-name').keyup(function() {
        var searchTerm = $(this).val().toLowerCase();
        if (searchTerm == '') {
          $('#edit-country .collection-item').removeClass('hide');
        } else {
          $('#edit-country .collection-item').each(function(index, country) {
            country = $(country);
            if (country.text().toLowerCase().indexOf(searchTerm) == -1) {
              country.addClass('hide');
            } else {
              country.removeClass('hide');
            }
          });
        }
      })
    },
    countryDescriptor: function(country) {
      return (country.alpha3Code + " - " + country.name);
    },
    fetchAllCountries: function() {
      var that = this;
      $.ajax({
        url: "https://restcountries.eu/rest/v1/all"
      }).done(function(data) {
        $('#loader').addClass('hide');
        $('#content').removeClass('hide');
        that.allCountries = data;
        that.selectedCountries[0] = that.fetchCountryByCode("IND");
        that.selectedCountries[1] = that.fetchCountryByCode("USA");
        that.renderCountry(0);
        that.renderCountry(1);
        that.populateEditModalList();
      });
    },
    fetchCountryByCode: function(countryCode) {
      var match = {};
      var that = this;
      for(var i = 0; i < that.allCountries.length; i++) {
        var country = that.allCountries[i];
        if (country.alpha3Code == countryCode) {
          match = country;
          break;
        }
      }

      return match;
    },
    init: function() {
      $('.modal').modal();
      this.selectedCountries = [];
      this.renderCountriesFromTemplate();
      this.fetchAllCountries();
      this.bindEditCountryTriggerToModal();
      this.bindEditCountrySearch();
    },
    populateEditModalList: function() {
      var parent = $('#edit-country .collection');
      var links = "";
      var that = this;
      this.allCountries.forEach(function(country) {
        links += ("<a href='#' class='collection-item' data-country-code='" + country.alpha3Code + "'>" + that.countryDescriptor(country) + "</a>");
      });
      parent.html(links);
      this.bindEditCountryModalLinks();
    },
    renderCountriesFromTemplate: function() {
      var template = $('#countryTemplate').html();
      Mustache.parse(template);
      var rendered = Mustache.render(template, {countryIndex: 0}) + Mustache.render(template, {countryIndex: 1});
      $('#countries').html(rendered);
    },
    renderCountry: function(countryIndex) {
      var countryContainer = $('#country-' + countryIndex);
      var country = this.selectedCountries[countryIndex];
      countryContainer.find('h2 .country-code').html(country.alpha3Code);
      countryContainer.find('p.name').html(country.name);
      countryContainer.find('.population p').html(country.population.toReadable());
      countryContainer.find('.area p').html(country.area.toReadable() + '<span class="units">km<sup>2</sup></span>');
      var populationDensity = parseInt(country.population / country.area);
      countryContainer.find('.population-density p').html(populationDensity.toReadable() + '<span class="units">people/km<sup>2</sup></span>');
      countryContainer.find('.gini p').html(country.gini || "N/A");
    }
  }

  $(document).ready(function() {
    CountryComparer.init();
  });
})();
