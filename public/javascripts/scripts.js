"use strict";

Vue.component('lista', {
 props: ['teksti', 'index', 'user'],
 template: '<li class="collection-item amber lighten-2 flow-text"><div class="row"><div class="col m10 s10">{{ teksti }}</div><div class="blue-text col m10 s10">sent by {{ user }}</div><div class="col m2 s2"><a class="btn btn-small waves-effect waves-light blue" v-on:click="$emit(`deletion`, index)">Delete</a></div></div></li>' // template sisältää deletionnapin
})

Vue.component('scoreboard', {
 props: ['value', 'person'],
 template: '<li class="collection-item amber lighten-2 flow-text"><div class="row"><div class="col m10 s10"><div class="col m10 s10">{{ value }} seconds</div><div class="blue-text col m10 s10">by {{ person }}</div></div></div></li>'
})


const myVue = new Vue({
  el: '#app',
  created() {
      this.getThings();
      this.getScores();
  },
  data() {
    return {
      message: {
        teksti: String
      },
      written: '',
      errors: [],
      messages: [],
      scores: [],
   };
  },

  methods: {
    // Adding a new chat message to database
    addThing: function(){
      let newThing = {
        teksti: this.written
      }
      axios.post("/posts/create", newThing)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
      this.getThings();
      this.written = '';
    },

    // Getting recent chat messages
    getThings: function(){
      axios.get("/posts")
        .then(res =>{
          this.messages = res.data.slice(-5).reverse();
        })
        .catch(function (error) {
          console.log(error);
        })
    },

    // Add-function to check message and then call addThing
    adding() {
      // Error handle
      this.errors = [];
      if (!this.written) {
        this.errors.push('Message required.');
      }
      if (this.written.length > 30) {
        this.errors.push('Message too long! (max 30)');
      }
      // In case no errors
      if (!this.errors.length) {
        if (this.written === '') {
          return;
        }
        // Add to database
        this.addThing();
        this.message.written = '';
        // Refresh messages
        this.getThings();
      }
    },

    // Deletion of messages
   deletion(index) {
      var delurl = '/posts/' + this.messages[index]._id + '/delete';
      axios.post(delurl);
      this.getThings();
    },

    // Methods for game scoreboard
    //////////////////////////////////
    addScore: function(score) {
      let newScore = {
        points: score
      }
      axios.post("/scores/create", newScore)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
      this.getScores();
    },

    getScores: function(){
      axios.get("/scores")
        .then(res =>{
          res.data.sort(this.compare);
          this.scores = res.data.slice(0,5); // Only the best scores
        })
        .catch(function (error) {
          console.log(error);
        })
    },

    // Comparison function for sorting
    compare: function(a, b) {
      const genreA = a.points;
      const genreB = b.points;

      let comparison = 0;
      if (genreA > genreB) {
        comparison = 1;
      } else if (genreA < genreB) {
        comparison = -1;
      }
      return comparison;
    }
  }
})
