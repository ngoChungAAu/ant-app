import CommonPage from '@/components/CommonPage';
import React from 'react';

const CommonList: React.FC = () => {
  return (
    <CommonPage
      base="post"
      title="Manage post"
      renderPro={[
        {
          title: 'Title',
          dataIndex: 'title',
          hideInSearch: false,
          rules: [
            {
              required: true,
              message: 'Required',
            },
          ],
        },
        {
          title: 'Description',
          dataIndex: 'description',
        },
        {
          title: 'Created At',
          dataIndex: 'createdAt',
          valueType: 'dateTime',
          useForm: false,
        },
      ]}
    />
  );
};

export default CommonList;
