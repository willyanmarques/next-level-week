import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsController {
  async index(req: Request, res: Response) {
    //usar await para experar a query terminar
    const items = await knex('items').select('*');
    const serializedItems = items.map(item => {
      return {
        id: item.id,
        title: item.title,
        url_image: `http://localhost:3333/uploads/${item.image}`
      }
    })
    return res.header(
      'Access-Control-Allow-Headers', '*'
    )
      .json(serializedItems);
  }
}

/* 
padrao de nomes de metodos no controller:
index: listagem
show: exibir unico registro
create: criar registro
update: editar registro
delete: deletar registro
*/

export default ItemsController;