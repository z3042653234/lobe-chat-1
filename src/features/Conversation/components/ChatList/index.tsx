import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import type { ChatMessage } from '@/types/message';

import { ListItemProps } from './Item';
import List from './List';
import { useStyles } from './style';

export interface ChatListProps extends ListItemProps {
  className?: string;
  /**
   * @description Data of chat messages to be displayed
   */
  data: ChatMessage[];
  enableHistoryCount?: boolean;
  historyCount?: number;
  loadingId?: string;
}
export type {
  OnActionsClick,
  OnAvatatsClick,
  OnMessageChange,
  RenderAction,
  RenderErrorMessage,
  RenderItem,
  RenderMessage,
  RenderMessageExtra,
} from './Item';

const ChatList = memo<ChatListProps>(
  ({
    onActionsClick,
    onAvatarsClick,
    renderMessagesExtra,
    className,
    data,
    type = 'chat',
    text,
    showTitle,
    onMessageChange,
    renderMessages,
    renderErrorMessages,
    loadingId,
    renderItems,
    enableHistoryCount,
    renderActions,
    historyCount = 0,
  }) => {
    const { cx, styles } = useStyles();

    const props = {
      enableHistoryCount,
      historyCount,
      onActionsClick,
      onAvatarsClick,
      onMessageChange,
      renderActions,
      renderErrorMessages,
      renderItems,
      renderMessages,
      renderMessagesExtra,
      showTitle,
      text,
      type,
    };
    return (
      <Flexbox className={cx(styles.container, className)} height={'100%'}>
        <div style={{ flex: '1' }}>
          <List {...props} />
        </div>
      </Flexbox>
    );
  },
);

export default ChatList;
