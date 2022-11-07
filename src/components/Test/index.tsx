import {
  addItem,
  deleteItem,
  getItemByID,
  getItems,
  updateItem,
} from '@/services/ant-design-pro/common';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ModalForm } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Space } from 'antd';
import type { ReactNode } from 'react';
import React from 'react';

interface Props {
  base: string;
  title: string;
  columns: ProColumns<any>[];
  components?: any;
  child?: ReactNode;
}

const getList = async (
  base: string,
  params: {
    current: number;
    pageSize: number;
  },
) => {
  const { current, pageSize, ...leftParams } = params;

  const keys = Object.keys(leftParams);

  const newParams = keys.reduce((obj: any, key: string) => {
    if (leftParams && Object.prototype.hasOwnProperty.call(leftParams, key)) {
      obj[`search_${key}`] = leftParams[key];
    }
    return obj;
  }, {});

  try {
    const { items, totalItems } = await getItems(base, {
      page: current,
      size: pageSize,
      ...newParams,
    });
    return {
      data: items,
      success: true,
      total: totalItems,
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
  const hide = message.loading('deleting...');
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

export default function Test(props: Props) {
  const { base, title, columns, components, child } = props;

  console.log(child);

  const [id, setID] = React.useState<string>('');
  const [add, setAdd] = React.useState<boolean>(false);
  const [edit, setEdit] = React.useState<boolean>(false);
  const [remove, setRemove] = React.useState<boolean>(false);
  const actionRef = React.useRef<ActionType>();

  return (
    <>
      <ProTable<any, any>
        headerTitle={title}
        actionRef={actionRef}
        rowKey="_id"
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => setAdd(true)}>
            New
          </Button>,
        ]}
        request={(params) => {
          return getList(base, params);
        }}
        expandedRowRender={() => child}
        pagination={{
          pageSize: 5,
        }}
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
        modalProps={{
          destroyOnClose: true,
        }}
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
        abc
      </ModalForm>

      {/* update modal  */}

      <ModalForm
        title="Edit"
        width="400px"
        visible={edit}
        onVisibleChange={setEdit}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setID(''),
        }}
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
        abcd
      </ModalForm>

      {/* delete modal */}
      <ModalForm
        title="Delete"
        width="400px"
        visible={remove}
        onVisibleChange={setRemove}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setID(''),
        }}
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
    </>
  );
}
