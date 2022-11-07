import Test from '@/components/Test';
import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const TestPage: React.FC = () => {
  return (
    <PageContainer>
      <Test
        base="post"
        title="Manage post"
        columns={[
          {
            title: 'Title',
            dataIndex: 'title',
            hideInSearch: false,
          },
          {
            title: 'Description',
            dataIndex: 'description',
          },
          {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
          },
        ]}
        child={
          <Test
            base="post"
            title="Manage post"
            columns={[
              {
                title: 'Title',
                dataIndex: 'title',
                hideInSearch: false,
              },
              {
                title: 'Description',
                dataIndex: 'description',
              },
              {
                title: 'Created At',
                dataIndex: 'createdAt',
                valueType: 'dateTime',
              },
            ]}
          />
        }
      />
    </PageContainer>
  );
};

export default TestPage;
