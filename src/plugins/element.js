import ElementPlus from 'element-plus';
import '../assets/scss/element-variables.scss';
import locale from 'element-plus/lib/locale/lang/nl';

export default (app) => {
  app.use(ElementPlus, { locale });
};
