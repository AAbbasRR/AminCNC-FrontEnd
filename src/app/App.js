import React, { useEffect } from 'react';

import './styles/App.css';

import AppRouter from '../routes/router/AppRouter';

import { useDispatch } from 'react-redux';
import { setAction } from '../redux/actions/CategoriesActions';

import CallApi from '../functions/CallApi';
import { GetCategorisListAPI } from '../api/Products';

const App = () => {
  const reduxDispatch = useDispatch();

  useEffect(() => {
    getAppDatas();
  }, []);

  const getAppDatas = async () => {
    try {
      let response = await CallApi(GetCategorisListAPI());
      reduxDispatch(setAction(response));
    } catch (error) {
      console.log(error);
    };
  };

  return (
    <div className="App">
      <div className="backGroundImage" />
      <AppRouter />
    </div>
  );
}

export default App;
