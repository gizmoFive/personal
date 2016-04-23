app.config(function ($stateProvider) {
    $stateProvider.state('filters', {
        url: '/code/angular/filters',
        templateUrl: 'js/code/angular/filters/filters.html',
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
          
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
        },
        controller: 'filtersctrl'
    });
});


app.controller('filtersctrl', function ($scope, $filter) {
    $scope.exampleText = {
        "ipsum" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "hipsum" : "Pour-over whatever fashion axe echo park swag, kombucha locavore fingerstache cornhole church-key gentrify pop-up. Ethical seitan quinoa pabst single-origin coffee church-key. Venmo yuccie leggings +1 vice synth. Waistcoat lomo retro gochujang godard, cold-pressed craft beer swag squid sustainable typewriter quinoa tattooed. Cray PBR&B mixtape, humblebrag neutra marfa before they sold out single-origin coffee tofu cred YOLO irony. Cold-pressed twee iPhone typewriter, flexitarian readymade banjo mlkshk polaroid. Mlkshk synth umami, green juice neutra kitsch bitters.\
Gastropub letterpress cornhole, tacos schlitz freegan ennui cliche. Photo booth single-origin coffee keytar, post-ironic truffaut you probably haven't heard of them sustainable godard direct trade waistcoat VHS venmo street art. Raw denim seitan sustainable jean shorts fanny pack. Bicycle rights church-key keytar +1 photo booth tattooed, biodiesel pitchfork asymmetrical pug fap pork belly chartreuse intelligentsia. Farm-to-table yuccie gentrify authentic put a bird on it. Literally tousled affogato pug direct trade crucifix green juice, normcore bitters ramps seitan you probably haven't heard of them 3 wolf moon church-key swag. PBR&B brooklyn sustainable, tote bag pickled before they sold out everyday carry food truck crucifix wayfarers forage godard lumbersexual.\
Tofu affogato swag distillery, umami gentrify humblebrag squid franzen deep v kale chips street art brunch leggings gluten-free. Tilde heirloom fixie XOXO thundercats readymade meditation, next level franzen tattooed. Cronut pour-over semiotics pop-up neutra. Direct trade sustainable mlkshk, narwhal put a bird on it church-key twee before they sold out cray man braid locavore. Microdosing readymade cred offal, seitan hashtag deep v. Master cleanse cred chia keffiyeh. Vice plaid godard whatever.\
Drinking vinegar gastropub neutra, celiac biodiesel forage readymade migas photo booth butcher chartreuse kale chips. Typewriter tacos mixtape umami literally yr. DIY austin messenger bag kinfolk bicycle rights fixie, portland truffaut thundercats seitan tofu pork belly. Taxidermy kale chips tofu roof party fanny pack. Man braid sustainable seitan ethical. Wolf taxidermy selfies, synth kinfolk before they sold out sartorial echo park disrupt direct trade. Drinking vinegar typewriter neutra next level, gochujang XOXO brunch pickled.",
'testNumber' : 1002301237,
'testArray' : ['Fry', 'Professor', 'Hermes', 'Professor', 'Leela', 'Bender', 'Kif', 'Nibbler', 7849930, {'kittens' : 'feline', 'puppies' : 'canine'}, true, false, null, undefined, '', 0],
'testObject' : {
    "glossary": {
        "title": "example glossary",
        "GlossDiv": {
            "title": "S",
            "GlossList": {
                "GlossEntry": {
                    "ID": "SGML",
                    "SortAs": "SGML",
                    "GlossTerm": "Standard Generalized Markup Language",
                    "Acronym": "SGML",
                    "Abbrev": "ISO 8879:1986",
                    "GlossDef": {
                        "para": "A meta-markup language, used to create markup languages such as DocBook.",
                        "GlossSeeAlso": ["GML", "XML"]
                    },
                    "GlossSee": "markup"
                }
            }
        }
    }
}
};

$scope.currentText = $scope.exampleText.ipsum;

$scope.myFilter = 'lowercase';
 $scope.applyFilter = function(model, filter) {
        return $filter(filter)(model);
    };

var hasrun1= false;
var hasrun2= false;

$scope.$watch('userText', function() {
     if(hasrun2) {        
    $scope.currentText = $scope.userText;
    }
hasrun2 = true;
});

$scope.$watch('myInput', function() {
    if(hasrun1) {        
    $scope.currentText = $scope.exampleText[$scope.myInput];
    }
    hasrun1 = true;
});


$scope.runthisfunc = function() {
   $scope.currentText = document.getElementById('theTextArea').value;
   $scope.applyFilter($scope.currentText, $scope.myFilter);
};
});

/// custom filters

app.filter('reverse', function() {
  return function (input) {
    input = input || ' ';
    var out = "";
    for (var i = 0; i < input.length; i++) {
      out = input.charAt(i) + out;
    }
    return out;
  };
});

app.filter('deletePunctuation', function() {
    return function (input) {
        if(typeof input !== 'string') input = ' ';
        var re = /\w+/g;
       return input.match(re).join(' ');
    };
});

app.filter('onlyPunctuation', function() {
    return function (input) {
        if(typeof input !== 'string') input = ' ';
        var re = /\W+/g;
       return input.match(re).join(' ');
    };
});

app.filter('sort', function() {
    return function (input) {
        return input.sort();
    };
});

app.filter('unique', function() {
    return function (input) {
        if(typeof input === 'string') input = JSON.parse(input);
        return input.filter(function (item, index) {
            return input.indexOf(item) === index;
        });
    };
});

app.filter('truthy', function() {
    return function (input) {
        if(typeof input === 'string') input = JSON.parse(input);
        return input.filter(function (item) {
            return !!item;
        });
    };
});

app.filter('falsy', function() {
    return function (input) {
        if(typeof input === 'string') input = JSON.parse(input);
        return input.filter(function (item) {
            return !item;
        });
    };
});


