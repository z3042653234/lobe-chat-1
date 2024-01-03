import isEqual from 'fast-deep-equal';
import React, { ReactNode, useCallback, useEffect, useRef } from 'react';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  ListRowProps,
  ListRowRenderer,
} from 'react-virtualized';

import { ChatListProps } from '@/features/Conversation/components/ChatList/index';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { useSessionStore } from '@/store/session';
import { agentSelectors } from '@/store/session/selectors';
import { ChatMessage } from '@/types/message';

import Item from './Item';

// Generate some sample test data

const cache = new CellMeasurerCache({
  defaultHeight: 50,
  fixedWidth: true,
});

interface ItemProps extends ListRowProps {
  item: ChatMessage;
}

const RowItem = ({
  index,
  parent,
  key,
  style,
  item,
  isScrolling,
  isVisible,
  ...itemProps
}: ItemProps & ChatListProps): ReactNode => {
  return (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      index={index}
      key={key}
      parent={parent}
      rowIndex={index}
    >
      {({ registerChild, measure }) => (
        <div onLoad={measure} ref={registerChild} style={style}>
          <Item {...itemProps} {...item} />
        </div>
      )}
    </CellMeasurer>
  );
};

const Example = (props: ChatListProps) => {
  const meta = useSessionStore(agentSelectors.currentAgentMeta, isEqual);
  const listRef = useRef<List>();

  const data = useChatStore(chatSelectors.currentChatsWithGuideMessage(meta), isEqual);

  const resize = () => {
    if (listRef.current) {
      cache.clearAll();
      listRef.current.recomputeRowHeights();
    }
  };

  // 当消息更新时，重新计算高度并滚动到底部
  useEffect(() => {
    resize();
  }, [data]);

  useEffect(() => {
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  const rowRenderer: ListRowRenderer = useCallback(
    (p: ListRowProps) => RowItem({ ...p, item: data[p.index], ...props }),
    [data],
  );

  return (
    <AutoSizer>
      {({ width, height }) => (
        <List
          deferredMeasurementCache={cache}
          height={height}
          ref={listRef}
          rowCount={data.length}
          rowHeight={cache.rowHeight}
          rowRenderer={rowRenderer}
          scrollToIndex={data.length - 1}
          width={width}
        />
      )}
    </AutoSizer>
  );
};

export default Example;
