import { ExclamationCircleOutlined, FileAddOutlined } from '@ant-design/icons';
import { Button, Form, Input, List, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import './App.scss';
import { api } from './service/api';
const { Search } = Input;


function App() {
  // Define variaveis de estado
  const [lista, setLista] = useState<any>([]);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [item, setItem] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [search, setSearch] = useState<string>();
  const [refreshList, setRefreshList] = useState(false);

  // Inicia os formulários
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();

  // Define layout de formulário
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  // Mensagem de erro de formulário
  const validateMessages = {
    required: 'O campo ${label} é obrigatório!',
  };

  // Ação de edição de registro
  const onFinishEdit = (values: any) => {
    let { id } = item;
    setLoading(true);

    api.put(`/docs/${id}`, values).then(() => {
      sucesso('Registro atualizado com sucesso');
      setModalEdit(false);
      setLoading(false);
      setRefreshList(true);
    })
  };

  // Ação de novo de registro
  const onFinishAdd = (values: any) => {
    setLoading(true);

    api.post(`/docs`, values).then(() => {
      sucesso('Registro adicionado com sucesso');
      setModalAdd(false);
      setLoading(false);
      formAdd.resetFields();
      setRefreshList(true);
    })
  };

  // Ação de pesquisa de registro
  const onSearch = (value: string) => {
    setSearch(value);
  };

  useEffect(() => {
    let params = {};

    if (search) {
      params = {
        q: search
      }
    }
    api.get('/docs', { params }).then((response: any) => {
      let { data } = response;
      setRefreshList(false);
      setLista(data);
    });
  }, [refreshList, search]);

  // Modal para deletar registro
  function confirm(item: any) {
    Modal.confirm({
      title: 'Aviso',
      icon: <ExclamationCircleOutlined />,
      content: 'Deseja mesmo deletar esse registro?',
      okText: 'Sim',
      cancelText: 'Não',
      onOk: () => {
        let { id } = item;

        api.delete(`/docs/${id}`).then(() => {
          setLista(lista.filter((filterItem: any) => filterItem.id !== id));
          setRefreshList(true);
          sucesso('Item deletado com sucesso.');
        });
      }
    });
  }

  // Modal de sucesso de uma ação
  function sucesso(message: string) {
    Modal.success({
      title: 'Aviso',
      content: message,
    });
  }

  // Elementos da página usando componentes do Ant Design
  return (
    <>
      <div className="container-lista">
        {/* Caixa de pesquisa */}
        <Search placeholder="Pesquisar registro" allowClear onSearch={onSearch} style={{ width: 600 }} />
        &nbsp;
        &nbsp;
        &nbsp;
        {/* Botão para adicionar novo registro */}
        <Button type="primary" onClick={() => setModalAdd(true)} icon={<FileAddOutlined />}>
          Adicionar
        </Button>

        {/* Lista todos os registros com paginação */}
        <List
          className="lista"
          loading={lista.length === 0}
          itemLayout="horizontal"
          dataSource={lista}
          pagination={{
            showSizeChanger: false,
            pageSize: 15
          }}
          renderItem={(item: any) => (
            <List.Item
              actions={[<a onClick={() => { setModalView(true); setItem(item); }}>Detalhes</a>, <a onClick={() => { setModalEdit(true); setItem(item); formEdit.setFieldsValue(item); }}>Editar</a>, <a onClick={() => confirm(item)}>Deletar</a>]}
            >
              <List.Item.Meta
                title={item.siglauf}
              />
            </List.Item>
          )}
        />
      </div>

      {/* Modal de novo registro */}
      <Modal
        title="Adicionar registro"
        visible={modalAdd}
        onOk={() => {
          setModalAdd(false);
        }}
        onCancel={() => setModalAdd(false)}
        footer={false}
      >
        <Spin spinning={loading}>
          <Form {...layout} form={formAdd} name="nest-messages" onFinish={onFinishAdd} validateMessages={validateMessages}>

            <Form.Item name={['siglauf']} label="UF" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['ibge']} label="IBGE" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['anomes']} label="ANomes" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['qtd_ben_bas']} label="QtdBenBas" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['qtd_ben_var']} label="QtdBenVar" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['qtd_ben_bvj']} label="QtdBenBvj" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['qtd_ben_bvn']} label="QtdBenBvn" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['qtd_ben_bvg']} label="QtdBenBvg" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['qtd_ben_bsp']} label="QtdBenBsp" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <br />
            <br />
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 10 }}>
              <Button type="primary" htmlType="submit">
                Adicionar
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>

      {/* Modal de edição registro */}
      <Modal
        title="Editar registro"
        visible={modalEdit}
        onOk={() => {
          setModalEdit(false);
        }}
        onCancel={() => setModalEdit(false)}
        footer={false}
      >
        <Spin spinning={loading}>
          <Form {...layout} form={formEdit} name="nest-messages" onFinish={onFinishEdit} validateMessages={validateMessages}>

            <Form.Item name={['siglauf']} label="UF" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['ibge']} label="IBGE" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['anomes']} label="ANomes" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['qtd_ben_bas']} label="QtdBenBas" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['qtd_ben_var']} label="QtdBenVar" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['qtd_ben_bvj']} label="QtdBenBvj" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['qtd_ben_bvn']} label="QtdBenBvn" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['qtd_ben_bvg']} label="QtdBenBvg" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['qtd_ben_bsp']} label="QtdBenBsp" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <br />
            <br />
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 10 }}>
              <Button type="primary" htmlType="submit">
                Atualizar
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>

      {/* Modal de vizualização de registro */}
      <Modal
        title="Vizualizar registro"
        visible={modalView}
        onOk={() => {
          setModalView(false);
        }}
        onCancel={() => setModalView(false)}
      >
        <p>UF: {item.siglauf}</p>
        <p>IBGE: {item.ibge}</p>
        <p>ANomes: {item.anomes}</p>
        <p>QtdBenBas: {item.qtd_ben_bas}</p>
        <p>QtdBenVar: {item.qtd_ben_var}</p>
        <p>QtdBenBvj: {item.qtd_ben_bvj}</p>
        <p>QtdBenBvn: {item.qtd_ben_bvn}</p>
        <p>QtdBenBvg: {item.qtd_ben_bvg}</p>
        <p>QtdBenBsp: {item.qtd_ben_bsp}</p>
      </Modal>
    </>
  );
}

export default App;
