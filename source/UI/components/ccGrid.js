import { ref, computed, h } from '../../../static/vue.esm-browser.js';

export const CcGrid= {
  name: 'CcGrid',
  props: {
    items: {
      type: Array,
      required: true
    },
    itemSize: {
      type: String,
      default: '250px'
    }
  },
  setup(props, { slots }) {
    const gridStyle = computed(() => ({
      gridTemplateColumns: `repeat(auto-fill, minmax(${props.itemSize}, 1fr))`
    }));

    return () => h('div', { class: 'grid', style: gridStyle.value },
      props.items.map(item =>
        slots.default
          ? slots.default({ item })
          : h('div', { class: 'rss-card' }, [
              h('h2', { class: 'rss-card__title' }, item.title),
              h('p', { class: 'rss-card__content', domProps: { innerHTML: item.content } }),
              h('a', { class: 'rss-card__link', attrs: { href: item.link, target: '_blank' } }, '打开来源页')
            ])
      )
    );
  }
};