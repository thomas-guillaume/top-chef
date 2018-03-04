import React, { Component } from 'react';
import { Row, Col, Card, CardImg, CardText, CardBody, CardTitle, } from 'reactstrap';
import './App.css';
import json from './lafourchetteDeal.json';

class App extends Component {
  render() {
    return (
      <div className="App">

        <div class="header">
          <p><em class="top">Top</em><em class="chef">Chef</em></p>
        </div>


        <div class="container">
          <div class="row">
            <div class="col-sm">
            {
              json.map(function(restaurant){
                for(var i=0;i<restaurant.deal.length;i++) {
                  return (
                    <Card className="cards">
                    <div class="card text-left">
                      <div class="card-block">
                        <h4 class="card-title"> {restaurant.name}</h4>
                        <ul class="list-group">
                          <li class="list-group-item">{restaurant.star} Star(s)</li>
                          <li class="list-group-item">City: {restaurant.city}, {restaurant.zipcode}</li>
                          <li class="list-group-item">Deal(s) :
                            <ul class="list-deals">
                                <li class="list-group-item">{restaurant.deal[i].title}<br/>{restaurant.deal[i].exclusions}</li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                  </div>
                  </Card>
                  );
                }
              })
            }
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default App;
