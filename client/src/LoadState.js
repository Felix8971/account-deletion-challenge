const STATUS_PENDING = 'pending'; // Nothing is loaded yet.
const STATUS_FETCHING = 'fetching'; // Loading the first time or after error.
const STATUS_COMPLETED = 'completed'; // Data loaded successfully.
const STATUS_OUTDATED = 'outdated'; // Data is known to be outdated.
const STATUS_REFRESHING = 'refreshing'; // Data is already loaded but is refreshing.
const STATUS_ERROR = 'error'; // Load error.


export const pending = { status: STATUS_PENDING };

export const completed = { status: STATUS_COMPLETED };

// const refreshing = { status: STATUS_REFRESHING };

export const error = STATUS_ERROR;

const initWithError = error => ({ status: STATUS_ERROR, error });

export const isError = state => state.status === STATUS_ERROR;

export const shouldLoad = state =>
  state.status === STATUS_PENDING || state.status === STATUS_OUTDATED;// not used

export const isLoading = (state) => {
  if ( state && state.status) {
    return ( state.status === STATUS_PENDING ||
     state.status === STATUS_FETCHING ||
     state.status === STATUS_REFRESHING);
  } else {
    return false;
  }
}

// export const isLoadingFirstTime = state => state.status === STATUS_FETCHING;// not used

// export const isRefreshing = state => state.status === STATUS_REFRESHING;// not used

export const isLoaded = state =>
  state.status === STATUS_COMPLETED || state.status === STATUS_REFRESHING;

export const handleLoaded = state => completed;

// export const handleOutdated = state => outdated;// not used

/* export const handleLoadRequested = state => {
  const fetching = { status: STATUS_FETCHING };
  const outdated = { status: STATUS_OUTDATED };
  return state.status === STATUS_OUTDATED ? refreshing : fetching
};*/

export const handleLoadFailedWithError = error => {
  const nextState = initWithError(error)
  return state => nextState
};
