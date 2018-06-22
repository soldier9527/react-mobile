import {
  LOGIN,
  LOGOUT
} from '../actions/constants'

let initState = {
  showNavbar: false,
  showFooter: false
}

export default function (state = initState, action) {
  return {data: action.data };
}
