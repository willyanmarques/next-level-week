import e, { Request, Response, response } from 'express';
import knex from '../database/connection';

class PointsController {

  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    console.log(city);
    console.log(uf);
    console.log(items);

    //iterando os ids de itens recebidos, removendo espacos e adicionando a um novo array
    const arrItems = String(items)
    .split(',')
    .map(item => Number(item.trim()));

    console.log(arrItems);

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', arrItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*'); //todos os dados da tabela points e nao da tabela do join

      console.log(`query: ${JSON.stringify(points)}`);

    // if (!points) {
    //   return response.status(400).json({ error: 'ponto nao encontrado' });
    // }

    return response.json(points);
  }

  async create(req: Request, res: Response) {
    //desestruturando todas as variaveis vindas no body do request
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items } = req.body;

    /* usando transection pra segurar que se a segundo insert falhar o primeiro é 
    cancelado, garantir que ambos registros seram gravados*/
    const trx = await knex.transaction();

    /*quando o nome da propriedade é igual ao nome do campo do objeto
    podemos omitir: { name: name } == { name }*/
    //apos inserir o metodo de insert retorna os ids do registros que acabaram de ser inseridos

    const point = {
      image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    };
    console.log(`point insert: ${point}`);

    const insertedIds = await trx('points').insert(point);

    const point_id = insertedIds[0]; //posicao zero pois so foi inserido um registro

    const pointItems = items.map((item_id: number) => {
      return {
        item_id: item_id,
        point_id: point_id
      }
    });

    console.log(pointItems);

    await trx('point_items').insert(pointItems);
    //fazendo o insert de fato
    await trx.commit();
    //spred operator: pega todas as informacoes de um objeto e retorna dentro de outro
    return res.json({
      id: point_id,
      ...point,
    });

  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    //o .first() faz com que o retorno seja um objeto ao invez de uma lista
    const point = await knex('points').select('*').where('id', id).first();

    if (!point) {
      return response.status(400).json({ error: 'ponto nao encontrado' });
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id).select('items.id', 'items.title');

    return response.json({ point, items });
  }

}
export default PointsController;