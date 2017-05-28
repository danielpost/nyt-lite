/**
 * @fileoverview The New York Times Lite
 * @author Daniel Post
 * @version 1.0
 */

(function(window, document, undefined) {
    'use strict';

    /**
     * Initialize app.
     */

    var app = new Vue({

        el: '#app',

        data: {
            sections: [
                'all-sections',
                'Arts',
                'Automobiles',
                'Books',
                'Business Day',
                'Education',
                'Fashion & Style',
                'Food',
                'Health',
                'Job Market',
                'Magazine',
                'Movies',
                'Multimedia',
                'Opinion',
                'Public Editor',
                'Real Estate',
                'Science',
                'Sports',
                'Style',
                'Sunday Review',
                'T Magazine',
                'Technology',
                'The Upshot',
                'Theater',
                'Times Insider',
                'Travel',
                'U.S.',
                'World',
                'Your Money',
            ],
            periods: [
                '1',
                '7',
                '30'
            ],
            currentSection: 'all-sections',
            currentPeriod: 1,
            articles: null,
            loading: true,
            showFilter: false
        },

        created: function () {
            this.fetchData();
        },

        watch: {
            currentSection: 'fetchData',
            currentPeriod: 'fetchData'
        },

        filters: {
            formatSectionTitle: function (v) {
                return v.replace('all-sections', 'All Sections');
            },
            formatPeriod: function (v) {
                return v.replace('1', 'Today').replace('7', 'This week').replace('30', 'This month');
            }
        },

        methods: {
            fetchData: function () {
                var xhr = new XMLHttpRequest(),
                    self = this,
                    apiURL = 'https://api.nytimes.com/svc/mostpopular/v2/mostviewed/' + self.currentSection + '/' + self.currentPeriod + '.json?api-key=39abdacf3adc4a93a23bf03ed0790397';

                self.loading = true;

                xhr.open('GET', apiURL);

                xhr.onload = function () {
                    var articles = JSON.parse(xhr.responseText).results;

                    for (var i in articles) {
                        if (articles[i].media) {
                            articles[i].image = {};
                            articles[i].image.caption = articles[i].media[0].caption || '';
                            articles[i].image.copyright = articles[i].media[0].copyright || '';

                            // all-sections has different image thumbnails so we need to pick the correct ones.
                            var bigImage = self.currentSection === 'all-sections' ? 3 : 2,
                                smallImage = self.currentSection === 'all-sections' ? 1 : 0;

                            if (i % 3 === 0 ) {
                                articles[i].image.url = articles[i].media[0]['media-metadata'][bigImage].url;
                            } else {
                                articles[i].image.url = articles[i].media[0]['media-metadata'][smallImage].url;
                            }
                        }
                    }

                    self.articles = articles;

                    self.loading = false;
                };

                xhr.send();
            },
            showArticle: function (title) {
                var xhr = new XMLHttpRequest(),
                    self = this,
                    apiURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=39abdacf3adc4a93a23bf03ed0790397';

                xhr.open('GET', apiURL + '&q=' + title);

                xhr.onload = function () {
                    var article = JSON.parse(xhr.responseText).response.docs[0];

                    self.article = article;
                };

                xhr.send();
            }
        }

    });

})(window, document);
