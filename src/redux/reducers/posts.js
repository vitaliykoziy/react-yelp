/* eslint no-case-declarations: 0 */
import {
  FETCH_POST_REQUEST,
  FETCH_POST_SUCCESS,
  FETCH_POST_FAILURE,
// Posts comments
  FETCH_POST_COMMENTS_REQUEST,
  FETCH_POST_COMMENTS_SUCCESS,
  FETCH_POST_COMMENTS_FAILURE,
// Google map InformationWindow
  SHOW_GOOGLE_MARKER_INFO_WINDOW,
  CLOSE_GOOGLE_MARKER_INFO_WINDOW,
// Like/Dislike comments
  LIKE_COMMENT,
// Order comments
  ORDER_COMMENTS,
// Posts comments pagination
  FETCH_PAGINATIOM_POST_COMMENTS_REQUEST,
  FETCH_PAGINATIOM_POST_COMMENTS_SUCCESS,
  FETCH_PAGINATIOM_POST_COMMENTS_FAILURE,
} from '../actions/actionTypes';
import {
  LIKE,
  DISLIKE,
} from '../actions/likeComment';
import {
  ORDER_BY_DATE_A_Z,
  ORDER_BY_DATE_Z_A,
  ORDER_BY_LIKE_A_Z,
  ORDER_BY_LIKE_Z_A,
  ORDER_BY_UNLIKE_A_Z,
  ORDER_BY_UNLIKE_Z_A,
} from '../actions/orderComments';
// import utils
import { sortByProperties } from '../../utils/sortByProperties';
const initialStatePost = {
  isFetching: true,
  post: {},
};

const setGoogleMapData = (response) => {
  const newResponse = response;
  const markers = [];
  response.locations.map((location) => (
    markers.push({
      position: {
        lat: location.latitude,
        lng: location.longitude,
      },
      opacity: 1,
      infoWindow: {
        show: false,
        title: location.title,
        telephone: location.telephone,
        fax: location.fax,
      },
    })
  ));
  newResponse.googleMap = {
    markers,
    activeWindow: 0,
  };
  return newResponse;
};


const toggleInfoWindow = (state, currentWindowIndex) => {
  const newState = state;
  const prevActiveWindow = newState.post.googleMap.activeWindow;
  newState.post.googleMap.markers[prevActiveWindow].infoWindow.show = false;
  newState.post.googleMap.markers[currentWindowIndex].infoWindow.show = true;
  newState.post.googleMap.activeWindow = currentWindowIndex;
  return newState;
};

export const fetchPostDataReducer = (state = initialStatePost, action) => {
  const newState = state;
  switch (action.type) {
    case FETCH_POST_REQUEST:
      return Object.assign({}, state, {
        isFetching: 1,
        post: {},
      });
    case FETCH_POST_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        post: setGoogleMapData(action.response),
      });
    case FETCH_POST_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        post: {},
      });
    case SHOW_GOOGLE_MARKER_INFO_WINDOW:
      return Object.assign({}, state, toggleInfoWindow(state, action.index));
    case CLOSE_GOOGLE_MARKER_INFO_WINDOW:
      newState.post.googleMap.markers[action.index].infoWindow.show = false;
      return Object.assign({}, state, newState);
    default:
      return state;
  }
};

const initialStatePostComments = {
  isFetching: true,
  perPage: 3,
  currentPage: 1,
  totalCount: 0,
  comments: [],
};

export const fetchPostCommentsReducer = (state = initialStatePostComments, action) => {
  switch (action.type) {
    case FETCH_POST_COMMENTS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        comments: [],
      });
    case FETCH_POST_COMMENTS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        totalCount: action.response.totalCount,
        comments: action.response.comments,
      });
    case FETCH_POST_COMMENTS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        comments: [],
      });
    case LIKE_COMMENT:
      const comment = state.comments[action.index].likes;
      let { like, unlike } = comment;
      const prevLikeStatus = comment.likeStatus;
      const prevUnlikeStatus = comment.unlikeStatus;
      comment.likeStatus = action.likeType === LIKE && !prevLikeStatus;
      comment.unlikeStatus = action.likeType === DISLIKE && !prevUnlikeStatus;
      if (action.likeType === LIKE) {
        if ((!prevLikeStatus && !prevUnlikeStatus) || prevUnlikeStatus) {
          like++;
        }
      }
      if (action.likeType === DISLIKE) {
        if ((!prevLikeStatus && !prevUnlikeStatus) || prevLikeStatus) {
          unlike++;
        }
      }
      unlike = prevUnlikeStatus ? unlike - 1 : unlike;
      like = prevLikeStatus ? like - 1 : like;
      comment.like = like;
      comment.unlike = unlike;
      return Object.assign({}, state, comment);
    case ORDER_COMMENTS:
      let reverse;
      let orderKey;
      switch (action.orderType) {
        case ORDER_BY_DATE_Z_A:
        case ORDER_BY_LIKE_Z_A:
        case ORDER_BY_UNLIKE_Z_A:
          reverse = true;
          break;
        default:
          reverse = false;
          break;
      }
      switch (action.orderType) {
        case ORDER_BY_DATE_A_Z:
        case ORDER_BY_DATE_Z_A:
          orderKey = 'created_at';
          break;
        case ORDER_BY_LIKE_A_Z:
        case ORDER_BY_LIKE_Z_A:
          orderKey = 'likes.like';
          break;
        case ORDER_BY_UNLIKE_A_Z:
        case ORDER_BY_UNLIKE_Z_A:
          orderKey = 'likes.unlike';
          break;
        default:
          break;
      }
      return Object.assign({}, state, {
        comments: sortByProperties(state.comments, orderKey, true, reverse),
      });
    case FETCH_PAGINATIOM_POST_COMMENTS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        comments: [],
      });
    case FETCH_PAGINATIOM_POST_COMMENTS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        currentPage: action.page,
        totalCount: action.response.totalCount,
        comments: action.response.comments,
      });
    case FETCH_PAGINATIOM_POST_COMMENTS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        comments: [],
      });
    default:
      return state;
  }
};
