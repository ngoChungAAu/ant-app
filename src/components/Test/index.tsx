import {
  addItem,
  deleteItem,
  getItemByID,
  getItems,
  updateItem,
} from '@/services/ant-design-pro/common';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProFormText } from '@ant-design/pro-components';
import { ProFormDateTimePicker } from '@ant-design/pro-components';
import { ProFormDatePicker } from '@ant-design/pro-components';
import { ProFormTextArea } from '@ant-design/pro-components';
import { ModalForm } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Space } from 'antd';
import type { Rule } from 'antd/lib/form';
import type { ReactNode } from 'react';
import React from 'react';

type Col = ProColumns<any> & {
  mUseForm?: boolean;
  mComponent?: string | ReactNode;
  mRules?: Rule[];
};

type getDatas = (
  record?: any,
  params?: any,
  sort?: any,
  filter?: any,
) => Promise<Partial<{ data: any; success: boolean; total: number }>>;

type addData = (data?: any, record?: any) => void;

interface Props {
  base: string;
  title: string;
  getDatas?: getDatas;
  addData?: addData;
  columns: Col[];
  record?: any;
  expandedRowRender?: (record?: any) => ReactNode;
}

const getList = async (
  base: string,
  params: {
    current: number;
    pageSize: number;
  },
  getDatas?: getDatas,
  record?: any,
) => {
  const keys = Object.keys(params);

  const newParams = keys.reduce((obj: any, key: string) => {
    if (params && Object.prototype.hasOwnProperty.call(params, key)) {
      if (key === 'current') {
        obj.page = params[key];
      } else if (key === 'pageSize') {
        obj.size = params[key];
      } else {
      }
    }
    return obj;
  }, {});

  try {
    if (getDatas) {
      return getDatas(newParams, record);
    } else {
      const { items, totalItems } = await getItems(base, {
        ...newParams,
      });

      return {
        data: items,
        success: true,
        total: totalItems,
      };
    }
  } catch (error) {
    return {
      data: [],
      success: false,
      total: 0,
    };
  }
};

const handleAdd = async (base: string, values: any, addData?: addData, record?: any) => {
  const hide = message.loading('Adding...');
  try {
    if (addData) {
      await addData(values, record);
    } else {
      await addItem(base, { ...values });
    }
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
  const { base, title, getDatas, addData, columns, record: recordChild, expandedRowRender } = props;

  const [id, setID] = React.useState<string>('');
  const [add, setAdd] = React.useState<boolean>(false);
  const [edit, setEdit] = React.useState<boolean>(false);
  const [remove, setRemove] = React.useState<boolean>(false);
  const actionRef = React.useRef<ActionType>();

  const fields: ProColumns<any>[] = columns.map((e: Col) => {
    const { mComponent, mRules, mUseForm, ...data } = e as any;
    return data;
  });

  const components = columns.map((e: Col, i: number) => {
    const item = Object.assign(
      {
        mUseForm: true,
        mComponent: 'text',
      },
      e,
    );

    if (!item.mUseForm) return null;

    if (typeof item.mComponent !== 'string') {
      return item.mComponent;
    }

    if (item.mComponent === 'textarea') {
      return (
        <ProFormTextArea
          key={i}
          rules={item.mRules}
          width="md"
          name={item.dataIndex}
          label={item.title}
        />
      );
    }

    if (item.mComponent === 'date') {
      return (
        <ProFormDatePicker
          key={i}
          rules={item.mRules}
          width="md"
          name={item.dataIndex}
          label={item.title}
        />
      );
    }

    if (item.mComponent === 'datetime') {
      return (
        <ProFormDateTimePicker
          key={i}
          rules={item.mRules}
          width="md"
          name={item.dataIndex}
          label={item.title}
        />
      );
    }

    return (
      <ProFormText
        key={i}
        rules={item.mRules}
        width="md"
        name={item.dataIndex}
        label={item.title}
      />
    );
  });

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
          return getList(base, params, getDatas, recordChild);
        }}
        expandable={{
          expandedRowRender: expandedRowRender,
          rowExpandable: () => (expandedRowRender ? true : false),
        }}
        pagination={{
          pageSize: 5,
        }}
        columns={[
          ...fields,
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
          const success = await handleAdd(base, values, addData, recordChild);
          if (success) {
            setAdd(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        {components}
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
        {components}
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
