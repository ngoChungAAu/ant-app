import {
  addItem,
  deleteItem,
  getItemByID,
  getItems,
  updateItem,
} from '@/services/ant-design-pro/common';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProFormTextArea } from '@ant-design/pro-components';
import { ProFormText } from '@ant-design/pro-components';
import { ModalForm } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Space } from 'antd';
import type { Rule } from 'antd/lib/form';
import type { ReactNode } from 'react';
import React from 'react';

interface Item {
  title: string;
  dataIndex: string;
  valueType?: any;
  valueEnum?: any;
  render?: any;
  hideInSearch?: boolean;
  hideInTable?: boolean;
  useForm?: boolean;
  typeComponent?: string | ReactNode;
  rules?: Rule[];
}

interface Props {
  base: string;
  title: string;
  renderPro: Item[];
}

const getList = async (base: string) => {
  try {
    const { items } = await getItems(base);
    return {
      data: items,
      success: true,
      total: items.length,
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      total: 0,
    };
  }
};

const handleAdd = async (base: string, values: any) => {
  const hide = message.loading('Adding...');
  try {
    await addItem(base, { ...values });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

const handleUpdate = async (base: string, id: string, values: any) => {
  const hide = message.loading('Updating...');
  try {
    await updateItem(base, id, {
      ...values,
    });
    hide();
    message.success('Updated successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Updating failed, please try again!');
    return false;
  }
};

const handleDelete = async (base: string, id: string, values: any) => {
  const hide = message.loading('c...');
  try {
    await deleteItem(base, id, {
      ...values,
    });
    hide();
    message.success('Deleted successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Deleted failed, please try again!');
    return false;
  }
};

export default function CommonPage(props: Props) {
  const { base, title, renderPro } = props;

  const [id, setID] = React.useState<string>('');
  const [add, setAdd] = React.useState<boolean>(false);
  const [edit, setEdit] = React.useState<boolean>(false);
  const [remove, setRemove] = React.useState<boolean>(false);
  const actionRef = React.useRef<ActionType>();

  const columns: ProColumns<any>[] = renderPro.map((e: Item) => {
    const { useForm, typeComponent, rules, valueType, hideInSearch, ...data } = e as any;
    return { ...data, hideInSearch: hideInSearch ?? true, valueType: valueType ?? 'text' };
  });

  const fields = renderPro.map((e: Item, i: number) => {
    const item = Object.assign(
      {
        useForm: true,
        typeComponent: 'text',
      },
      e,
    );

    if (!item.useForm) return null;

    if (typeof item.typeComponent !== 'string') {
      return item.typeComponent;
    }

    if (item.typeComponent === 'textarea') {
      return (
        <ProFormTextArea
          key={i}
          rules={item.rules}
          width="md"
          name={item.dataIndex}
          label={item.title}
        />
      );
    }

    return (
      <ProFormText key={i} rules={item.rules} width="md" name={item.dataIndex} label={item.title} />
    );
  });

  return (
    <PageContainer>
      <ProTable<any, any>
        headerTitle={title}
        actionRef={actionRef}
        rowKey="_id"
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => setAdd(true)}>
            New
          </Button>,
        ]}
        request={() => getList(base)}
        columns={[
          ...columns,
          {
            title: 'Action',
            hideInSearch: true,
            render: (text, record) => (
              <Space size="middle">
                <a
                  onClick={() => {
                    setEdit(true);
                    setID(record._id);
                  }}
                >
                  Edit
                </a>
                <a
                  onClick={() => {
                    setRemove(true);
                    setID(record._id);
                  }}
                >
                  Delete
                </a>
              </Space>
            ),
          },
        ]}
      />

      {/* add new modal  */}
      <ModalForm
        title="Add"
        width="400px"
        visible={add}
        onVisibleChange={setAdd}
        onFinish={async (values) => {
          const success = await handleAdd(base, values);
          if (success) {
            setAdd(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        {fields}
      </ModalForm>

      {/* update modal  */}
      <ModalForm
        title="Edit"
        width="400px"
        visible={edit}
        onVisibleChange={setEdit}
        request={async () => {
          return await getItemByID(base, id);
        }}
        onFinish={async (values) => {
          const success = await handleUpdate(base, id, values);

          if (success) {
            setEdit(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        {fields}
      </ModalForm>

      {/* delete modal */}
      <ModalForm
        title="Delete"
        width="400px"
        visible={remove}
        onVisibleChange={setRemove}
        onFinish={async (values) => {
          const success = await handleDelete(base, id, values);

          if (success) {
            setRemove(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        Are you sure?
      </ModalForm>
    </PageContainer>
  );
}
