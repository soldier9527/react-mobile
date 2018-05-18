//方法继承组件

import React from 'react';
// 1
import {IntervalEnhance} from './IntervalEnhance';

class CartItem extends React.Component {
    render() {
        return (
            <article className="row large-4">

                <p className="large-12 column" >
                    <strong>Time elapsed for interval: </strong>
                    {this.props.seconds} ms
                </p>

            </article>
        );
    }
}
//2
export default IntervalEnhance(CartItem);