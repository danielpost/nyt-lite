/**
 * @fileoverview ArtistYear JavaScript Functionality
 * @author Daniel Post
 * @version 1.0
 */

(function(window, document, undefined) {
    'use strict';

    /**
     * App
     */

    var apiURL = 'https://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/1.json?api-key=39abdacf3adc4a93a23bf03ed0790397';

    var app = new Vue({

        el: '#app',

        data: {
            articles: null
        },

        created: function () {
            this.fetchData();
        },

        filters: {
            truncate: function (v) {
                var newline = v.indexOf('\n');
                return newline > 0 ? v.slice(0, newline) : v;
            },
            formatDate: function (v) {
                return v.replace(/T|Z/g, ' ');
            }
        },

        methods: {
            fetchData: function () {
                var xhr = new XMLHttpRequest(),
                    self = this;

                xhr.open('GET', apiURL);

                xhr.onload = function () {
                    var articles = JSON.parse(xhr.responseText).results;

                    for (var i in articles) {
                        articles[i].image = {};
                        articles[i].image.caption = articles[i].media[0].caption;
                        articles[i].image.copyright = articles[i].media[0].copyright;
                        articles[i].image.url = articles[i].media[0]['media-metadata'][3].url;
                    }

                    self.articles = articles;
                };

                xhr.send();
            }
        }

    });

})(window, document);
