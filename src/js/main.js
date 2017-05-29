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
            periods: {
                1: 'Today',
                7: 'This week',
                30: 'This month'
            },
            types: {
                mostviewed: 'Most viewed',
                mostshared: 'Most shared',
                mostemailed: 'Most emailed',
            },
            currentSection: 'all-sections',
            currentPeriod: 1,
            currentType: 'mostviewed',
            articles: null,
            loading: true,
            showFilter: false
        },

        created: function () {
            this.fetchData();
        },

        watch: {
            currentSection: 'fetchData',
            currentPeriod: 'fetchData',
            currentType: 'fetchData',
            showFilter: 'lockBody'
        },

        filters: {
            formatSectionTitle: function (v) {
                return v.replace('all-sections', 'All Sections');
            }
        },

        methods: {
            fetchData: function () {
                var xhr = new XMLHttpRequest(),
                    self = this,
                    apiURL = 'https://api.nytimes.com/svc/mostpopular/v2/' + self.currentType + '/' + self.currentSection + '/' + self.currentPeriod + '.json?api-key=39abdacf3adc4a93a23bf03ed0790397';

                self.loading = true;

                xhr.open('GET', apiURL);

                xhr.onload = function () {
                    var articles = JSON.parse(xhr.responseText).results;

                    for (var i in articles) {
                        if (articles[i].media) {
                            articles[i].image = {};
                            articles[i].image.caption = articles[i].media[0].caption || '';
                            articles[i].image.copyright = articles[i].media[0].copyright || '';

                            /**
                             * For some reason, all-sections combined with mostviewed has different
                             * image formats so we need to account for that.
                             */
                            var isDifferentFormat = self.currentSection === 'all-sections' && self.currentType === 'mostviewed',
                                bigImage = isDifferentFormat ? 3 : 2,
                                smallImage = isDifferentFormat ? 1 : 0;

                            if (i % 3 === 0 ) {
                                articles[i].image.url = articles[i].media[0]['media-metadata'][bigImage].url || '';
                            } else {
                                articles[i].image.url = articles[i].media[0]['media-metadata'][smallImage].url || '';
                            }
                        }
                    }

                    self.articles = articles;

                    self.loading = false;

                    console.log(articles);
                };

                xhr.send();
            },

            lockBody: function () {
                var self = this,
                    body = document.body,
                    lockedClass = 'is-locked';

                if (self.showFilter) {
                    body.classList.add(lockedClass);
                } else {
                    body.classList.remove(lockedClass);
                }
            }
        }

    });

})(window, document);
