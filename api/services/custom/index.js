import _ from 'lodash';
import { items, keywords } from './todos';

export default function customService(app) {
  app.use('/load-todos', (req, res) => {
    const { filterKeywords, propertyName, isAsc } = req.body;

    let newItems = [];
    if (filterKeywords != null && filterKeywords.length > 0) {
      newItems = items.filter(item => {
        const hash = item.title.split(" ").reduce((agg, keyword) => {
          agg[keyword] = true;
          return agg;
        }, {});

        return filterKeywords.every(({ value }) => hash[value] != null);
      });
    } else {
      newItems = items.slice();
    }

    if (propertyName != null) {
      newItems.sort((a, b) => {
        if (a[propertyName] < b[propertyName]) {
          return isAsc ? 1 : -1;
        }
        if (a[propertyName] > b[propertyName]) {
          return isAsc ? -1 : 1;
        }
        return 0;
      });
    }
    res.json({ items: newItems });
  });

  app.use('/load-keywords', (req, res) => {
    const { filterKeyword } = req.query;
    let filtered = [];
    if (filterKeyword != null && filterKeyword.length > 0) {
      filtered = keywords.filter(item => item.value.substr(0, (filterKeyword || "").length) == filterKeyword)
    }
    res.json({ keywords: filtered });
  });
}
