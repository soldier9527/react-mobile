import React, { Component, PropTypes } from 'react'
import {Link} from 'react-router-dom';
import { Carousel, Icon, Row, Col } from 'antd';

import Api from '../api';



export default class CarouselHome extends Component {

  constructor(props) {
      super(props);


}


     render(){



         return(

              <div>

                <Link to={{pathname:'promo/user'}}>


                  <img src={this.props.item.image_path} />

            </Link>

           </div>
         )
     }


}
