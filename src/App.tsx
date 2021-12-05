import { Card, Descriptions, Divider, Image, Input, List, Modal, Progress, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import './App.scss';
import { api } from './service/api';
const { Search } = Input;
const { Meta } = Card;

function App() {
  // Define variaveis de estado
  const [lista, setLista] = useState<any>([]);
  const [modalView, setModalView] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [count, setCount] = useState(0);
  const [limit,] = useState(35);
  const [offset, setOffset] = useState(0);
  const [pokemonDetail, setPokemonDetail] = useState<any>();

  // Ação de pesquisa de registro
  const onSearch = (value: string) => {
    if (value) {
      detailsPokemon(value);
    }
  };

  useEffect(() => {
    let params = { offset, limit };

    api.get('/pokemon', { params }).then((response: any) => {
      let { data } = response;
      let { results, count } = data;

      setCount(count);
      setRefreshList(false);
      setLista(results);
    });
  }, [refreshList, offset, limit]);

  const getPokemonId = (urlPokemon: string) => {
    return (urlPokemon.split('/pokemon/')[1]).replace('/', '');
  }

  const detailsPokemon = (pokemonId: string) => {
    api.get(`/pokemon/${pokemonId}`).then((response: any) => {
      setModalView(true);
      const { data } = response;

      setPokemonDetail(data);
    }).catch(() => {
      error();
    });
  }

  const error = () => {
    Modal.error({
      title: 'Atenção',
      content: 'O Pokémon digitado não existe. Tente digitar o nome igual do card da Pokedex.',
    });
  }

  // Elementos da página usando componentes do Ant Design
  return (
    <>
      <div className="container-lista">
        {/* Caixa de pesquisa */}
        <Search className="pokemon-search" placeholder="Pesquisar pokemon pelo nome" allowClear onSearch={onSearch} style={{ width: '100%' }} />
        &nbsp;
        &nbsp;
        &nbsp;

        {/* Lista todos os pokemons com paginação */}
        <List
          grid={{
            gutter: 32,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
          }}
          className="lista"
          loading={lista.length === 0}
          itemLayout="horizontal"
          dataSource={lista}
          pagination={{
            defaultCurrent: 1,
            showSizeChanger: false,
            total: count,
            pageSize: limit,
            onChange: (page) => {
              setOffset((page - 1) * limit);
            }
          }}
          renderItem={(item: any) => (
            <List.Item>
              <Card
                hoverable
                className={`pokemon-${item.name}`}
                style={{ width: 240 }}
                onClick={() => detailsPokemon(getPokemonId(item.url))}
                cover={<img alt={item.name} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonId(item.url)}.png`} onError={(e: any) => e.target.src = './img/pokeball.png'} />}
              >
                <Meta title={item.name} />
              </Card>
            </List.Item>
          )}
        />
      </div>

      {/* Modal de vizualização de pokemon */}
      <Modal
        title="Detalhes do pokemon"
        visible={modalView}
        onOk={() => {
          setModalView(false);
        }}
        onCancel={() => {
          setModalView(false)
        }}
      >
        {!pokemonDetail
          ? (
            <div className="load-spin">
              <Spin />
            </div>
          ) : (
            <>
              <div className="head">

                <p className={`title title-pokemon-${pokemonDetail.name}`}>{pokemonDetail.name}</p>

                <Image
                  width={200}
                  src={pokemonDetail.sprites.other['official-artwork'].front_default}
                />
              </div>

              <br />

              <div>
                <Descriptions
                  bordered
                  layout="vertical"
                >
                  <Descriptions.Item label="Abilities">
                    {pokemonDetail.abilities.map((ability: any, index: number) => {
                      return (
                        <div key={index}>
                          <p>{ability.ability.name}</p>
                          <br />
                        </div>
                      )
                    })}
                  </Descriptions.Item>
                  <Descriptions.Item label="Types">
                    {pokemonDetail.types.map((type: any, index: number) => {
                      return (
                        <div key={index}>
                          <p>{type.type.name}</p>
                          <br />
                        </div>
                      )
                    })}
                  </Descriptions.Item>
                </Descriptions>

                <Divider></Divider>

                <Descriptions
                  bordered
                  layout="vertical"
                >
                  <Descriptions.Item label="Base stats">
                    {pokemonDetail.stats.map((stat: any, index: number) => {
                      let percentage = (stat.base_stat * 100) / 260;

                      return (
                        <div key={index}>
                          <Progress percent={percentage} format={() => {
                            return stat.base_stat;
                          }} />
                          <p>{stat.stat.name}</p>
                          <br />
                        </div>
                      )
                    })}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </>
          )}
      </Modal>
    </>
  );
}

export default App;
