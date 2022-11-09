import Test from '@/components/Test';
import { addItem, getItemByID, getItems, updateItem } from '@/services/ant-design-pro/common';
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
            mUseForm: false,
          },
        ]}
        expandedRowRender={(record) => (
          <Test
            record={record}
            base="tag"
            title="Manage tabs"
            getDatas={async () => {
              const { tags } = await getItemByID('post', record._id);

              tags.map((tag: any) => (tag.tag = tag.tag[0]));

              return {
                data: tags,
                success: true,
                total: tags.length,
              };
            }}
            addData={async (data) => {
              await addItem('tag', { ...data, postId: record._id });
            }}
            columns={[
              {
                title: 'Tag',
                dataIndex: 'tag',
              },
            ]}
          />
        )}
      />
    </PageContainer>
  );
};

export default TestPage;
