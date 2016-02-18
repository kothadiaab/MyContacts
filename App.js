/**
 * Created by abhedkothadia on 2/14/16.
 */


$(document).on('click', '#newButton', function() {

    $("h3").html("ADD CONTACT");
    $("input").prop('disabled', false);
    $("img").replaceWith("<img id='image' alt='No Preview' border='15'/>");
    $("#newButton").prop('disabled', true);
});

document.getElementById("files").onchange = function () {
    var reader = new FileReader();

    reader.onload = function (e) {
        // get loaded data and render thumbnail.
        document.getElementById("image").src = e.target.result;
    };

    // read the image file as a data URL.
    reader.readAsDataURL(this.files[0]);
};

var myContApp = angular.module('myContacts', []);


myContApp.controller('contactController', function($scope, contactFactory){
    $scope.contacts = [];
    var key = null;

    init();

    function init () {
        $scope.contacts = contactFactory.getContacts();
    }

    $scope.addContact = function() {

        $("#newButton").prop('disabled', false);
        $scope.$broadcast('show-errors-event');

        if(!$scope.contactForm.firstName || !$scope.contactForm.lastName || !$scope.contactForm.birthDay || !$scope.contactForm.Company || !$scope.contactForm.email || !$scope.contactForm.phoneNumber){
            return;
        }

        //if($scope.contactForm.$invalid)
        //    return;

        var id = ( new Date().getTime());

        console.log("update key "+key);

        if(key){
            $scope.contacts[key-1].firstName = $scope.form.firstName;
            $scope.contacts[key-1].lastName = $scope.form.lastName;
            $scope.contacts[key-1]. birthDay = $scope.form.birthDay;
            $scope.contacts[key-1].Company = $scope.form.Company;
            $scope.contacts[key-1].email = $scope.form.email;
            $scope.contacts[key-1].phoneNumber = $scope.form.phoneNumber;
            $scope.contacts[key-1].image = $scope.form.image;
            key = null;
        }else{
            $scope.contacts.push(
                {
                    id: id,
                    firstName: $scope.form.firstName,
                    lastName: $scope.form.lastName,
                    birthDay: $scope.form.birthDay,
                    Company: $scope.form.Company,
                    email: $scope.form.email,
                    phoneNumber: $scope.form.phoneNumber,
                    image: $scope.form.image
                });
        }
        clearData();
    };

    $scope.deleteContact = function(contact){
        for ( var i = 0, length = $scope.contacts.length ; i < length ; i++ ) {
            if ($scope.contacts[i].id === contact.id ) {
                $scope.contacts.splice( i, 1 );
                break;
            }
        }
    };

    $scope.editContact = function(contact, index){

        $("h3").html("EDIT CONTACT ("+contact.firstName.toUpperCase()+" "+contact.lastName.toUpperCase()+")");
        key = index+1;
        console.log("edit key "+key);
        $("input").prop('disabled', false);
        $scope.form.firstName = contact.firstName;
        $scope.form.lastName = contact.lastName;
        $scope.form.birthDay = contact.birthDay;
        $scope.form.Company = contact.Company;
        $scope.form.email = contact.email;
        $scope.form.phoneNumber = contact.phoneNumber;
        $scope.form.image = contact.image;
    }

    $scope.cancelContact = function(contact, index){

        $("#newButton").prop('disabled', false);
        $scope.$broadcast('hide-errors-event');
        clearData();
    }

    function clearData(){
        $scope.form.firstName = "";
        $scope.form.lastName = "";
        $scope.form.birthDay = "";
        $scope.form.Company = "";
        $scope.form.email = "";
        $scope.form.phoneNumber = "";
        $scope.form.image = "";

        $("input").prop('disabled', true);
        $("img").replaceWith("<img id='image' alt='No Preview' border='15'/>");
    }

    //$scope.addNew = function(){
    //    $("h3").html("ADD CONTACT");
    //    $("input").prop('disabled', false);
    //    $("img").replaceWith("<img id='image' alt='No Preview' border='15'/>");
    //    clearData();
    //}
});

myContApp.factory('contactFactory', function(){
    var contacts = [];
    var factory = {};

    factory.getContacts = function  () {
        return contacts;
    };
    return factory;
});

myContApp.directive('showErrors', function($timeout) {
        return {
            restrict: 'A',
            require: '^form',
            link: function(scope, el, attrs, contactForm) {
                var inputEl = el[0].querySelector("[name]");
                var inputNgEl = angular.element(inputEl);
                var inputName = inputNgEl.attr('name');
                var helpText = angular.element(el[0].querySelector('.help-block'));

                inputNgEl.bind('blur', function(){
                    el.toggleClass('has-error', contactForm[inputName].$invalid);
                    helpText.toggleClass('hide', contactForm[inputName].$valid);
                });

                scope.$on('show-errors-event', function(){
                    el.toggleClass('has-error',contactForm[inputName].$invalid);
                });


                scope.$on('hide-errors-event', function(){
                    $timeout(function(){
                        el.removeClass('has-error');
                    }, 0, false);
                });
            }
        }
    });