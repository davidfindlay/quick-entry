import {MeetMerchandiseImage} from './meet-merchandise-image';

export class MeetMerchandise {
  id;
  meet_id;
  sku;
  item_name;
  description;
  stock_control;
  stock;
  deadline;
  gst_applicable;
  exgst;
  gst;
  total_price;
  max_qty;
  status;
  images: MeetMerchandiseImage[];
}
