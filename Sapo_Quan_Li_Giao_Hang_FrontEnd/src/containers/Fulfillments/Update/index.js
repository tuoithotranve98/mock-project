import React, { useEffect,useState } from "react";
import {
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  InputAdornment,
  Link,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  withStyles,
} from "@material-ui/core";
import { NavLink } from "react-router-dom";
import GridContainer from "../../../components/Grid/GridContainer";
import GridItem from "../../../components/Grid/GridItem";
import Card from "../../../components/Card/Card.js";
import CardHeader from "../../../components/Card/CardHeader/CardHeader.js";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import * as types from "./styles";
import Stepper from "../../../components/Stepper";
import ModalCancel from "../ModalCancel";
import DateFnsUtils from "@date-io/date-fns";
import imgCustomer from "./../../../assets/image/customper-noavatar.png";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { connect } from "react-redux";
import {
  deliverFulfillmentThunk,
  fetchFulfillmentById,
  receiveFulfillmentThunk,
  updateStatusFulfillmentThunk,
} from "../../../redux/actions/fulfillment";

import SearchIcon from "@material-ui/icons/Search";
import Autocomplete from "@material-ui/lab/Autocomplete";
import imgShipper from "./../../../assets/image/customper-noavatar.png";
import { addItemShipper, fetchListShipper, fetchListShipperThunk } from "../../../redux/actions/shipper";
import NumberFormat from "react-number-format";
import ModalHandOver from "../ModalHandOver";

const ListStepperSuccess = [
  "Tạo phiếu",
  "Chờ lấy hàng",
  "Đã ở trong kho",
  "Đang giao hàng",
  "Hoàn thành",
];
const ListStepperShipingNow = [
  "Tạo phiếu",
  "Chờ lấy hàng",
  "Đang giao hàng",
  "Hoàn thành",
];
const CusTimelineItem = withStyles((theme) => ({
  missingOppositeContent: {
    "&::before": {
      display: "none",
    },
  },
}))(TimelineItem);

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

function Update(props) {
  const {
    match,
    fetchFulfillmentById,
    listShipper,
    fetchListShipper,
    detailFulfillment,
    receiveFulfillmentThunk,
    updateStatusFulfillmentThunk,
    deliverFulfillmentThunk,
    itemShipper,
    addItemShipper,
    miniActive
  } = props;
  const CusTextField = types.CusTextField;
  const classes = types.useStyles();
  const [modalCancel, setModalCancel] = useState(false);
  const [modalHandOver, setModalHandOver] = useState(false);
  const [open, setOpen] = useState(false);
  const [btnFoot, setBtnFoot] = useState(false);
  const [idShipper, setIdShipper] = useState(detailFulfillment.shipperDTO?.id?detailFulfillment.shipperDTO?.id:"");

  const loading = open && listShipper.totalItem === undefined ;
  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }
    (async () => {
      await sleep(1000);

      if (active) {
        fetchListShipper(0, 10);
      }
    })();
    return () => {
      active = false;
    };
  }, [loading]);
  useEffect(() => {
    fetchFulfillmentById(match.params.id);
  }, [match.params.id, fetchFulfillmentById]);
  useEffect(() => {
    setBtnFoot(
      window.innerHeight + document.documentElement.scrollTop >=
        document.scrollingElement.scrollHeight - 40
    );
    window.onscroll = () => {
      setBtnFoot(
        window.innerHeight + document.documentElement.scrollTop >=
          document.scrollingElement.scrollHeight - 50
      );
    };
  }, []);
  function convertMilisecondToDateTime(time) {
    let d = new Date(time);

    let day;
    if (d.getDate() < 10) {
      day = "0" + d.getDate();
    } else {
      day = d.getDate();
    }

    let mon;
    if (d.getMonth() + 1 < 10) {
      mon = "0" + (d.getMonth() + 1);
    } else {
      mon = d.getMonth() + 1;
    }
    let year = d.getFullYear();

    let h;
    if (d.getHours() < 10) {
      h = "0" + d.getHours();
    } else {
      h = d.getHours();
    }

    let m;
    if (d.getMinutes() < 10) {
      m = "0" + d.getMinutes();
    } else {
      m = d.getMinutes();
    }
    return `${day}-${mon}-${year} | ${h}:${m}`;
  }

  const listStepper = () => {
    var listAction = detailFulfillment?.fulfillmentTrackingEntities;
    let status= detailFulfillment?.shippingMethod?detailFulfillment?.shippingMethod:0;
    let arr1 = []; //mang trang thai
    let arr2 = {}; // mang danh dau
    if(status===0){
      for (let index = 0; index < listAction?.length; index++) {
        let element = listAction[index];
        if (arr2[element.action] === 0 || arr2[element.action] === undefined) {
          if (element?.action === "Tạo phiếu") {
            arr1.push("Tạo phiếu");
            arr1.push("Chờ lấy hàng");
          }
          if (element?.action === "Nhập kho") {
            arr1.push("Đã ở trong kho");
          }
          if (element?.action === "Xuất kho") {
            arr1.push("Đang giao hàng");
          }
          if (element?.action === "Đã hủy") {
            arr1.push("Đã hủy");
          }
          arr2[element.action] = 1;
        }
      }
    }else{
      for (let index = 0; index < listAction?.length; index++) {
        let element = listAction[index];
        if (arr2[element.action] === 0 || arr2[element.action] === undefined) {
          if (element?.action === "Tạo phiếu") {
            arr1.push("Tạo phiếu");
            arr1.push("Chờ lấy hàng");
          }
          if (element?.action === "Đã lấy hàng") {
            arr1.push("Đã lấy hàng");
          }
          if (element?.action === "Đã hủy") {
            arr1.push("Đã hủy");
          }
          arr2[element.action] = 1;
        }
      }
    }
    return arr1;
  };
  const onClickSuccessFulfillment  = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    updateStatusFulfillmentThunk(4, match.params.id,'')
  }
  const ButtonAction = () => {
    var status =false;
    var listAction = detailFulfillment?.fulfillmentTrackingEntities;
    for (let index = 0; index < listAction?.length; index++) {
      let element = listAction[index];
        if (element?.action === "Giao lại") {
           status=true;
           break;
        }
    }
   
    if (detailFulfillment?.fulfillmentDetailDTOList?.length > 0) {
      if ((detailFulfillment?.shippingStatus === 1 && detailFulfillment.shippingMethod===0) || detailFulfillment?.shippingStatus === 5) {
        return (
          <Grid className={classes.jss11}>
            <Button
              className={classes.save}
              onClick={() =>
                receiveFulfillmentThunk(match.params.id, idShipper)
              }
            >
              Nhập Kho
            </Button>
            <Button
              className={classes.cancle}
              onClick={() => setModalCancel(true)}
            >
              Hủy phiếu
            </Button>
          </Grid>
        );
      } else if (detailFulfillment?.shippingStatus === 1 && detailFulfillment.shippingMethod===1) {
        return (
          <Grid className={classes.jss11}>
            <Button
              className={classes.save}
              onClick={() => updateStatusFulfillmentThunk(3, match.params.id,'')}
            >
             Đã lấy hàng
            </Button>
            <Button
              className={classes.cancle}
              onClick={() => setModalCancel(true)}
            >
              Hủy phiếu
            </Button>
          </Grid>
        );
      }else if (detailFulfillment?.shippingStatus === 2) {
        return (
          <Grid className={classes.jss11}>
            <Button
              className={classes.save}
              onClick={() =>
                deliverFulfillmentThunk(match.params.id, idShipper)
              }
            >
              Xuất kho
            </Button>
            <Button
              className={classes.cancle}
              onClick={() => setModalCancel(true)}
            >
              Hủy phiếu
            </Button>
          </Grid>
        );
      } else if (detailFulfillment?.shippingStatus === 3 && status===false && detailFulfillment?.shippingMethod === 0) {
        return (
          <Grid className={classes.jss11}>
            <Button
              className={classes.save}
              onClick={() => onClickSuccessFulfillment()}
            >
              Hoàn Thành
            </Button>
            <Button
              className={classes.save}
              style={{ marginRight: 5 }}
              onClick={() => setModalHandOver(true)}
            >
              Để giao lại sau
            </Button>
            <Button
              className={classes.cancle}
              onClick={() => setModalCancel(true)}
            >
              Hủy phiếu
            </Button>
          </Grid>
        );
      }else if (detailFulfillment?.shippingStatus === 3  && status===true) {
        return (
          <Grid className={classes.jss11}>
            <Button
              className={classes.save}
              onClick={() => updateStatusFulfillmentThunk(4, match.params.id,'')}
            >
              Hoàn Thành
            </Button>
            <Button
              className={classes.cancle}
              onClick={() => setModalCancel(true)}
            >
              Hủy phiếu
            </Button>
          </Grid>
        );
      }else if (detailFulfillment?.shippingStatus === 3  && detailFulfillment?.shippingMethod === 1) {
        return (
          <Grid className={classes.jss11}>
            <Button
              className={classes.save}
              onClick={() => updateStatusFulfillmentThunk(4, match.params.id,'')}
            >
              Hoàn Thành
            </Button>
            <Button
              className={classes.cancle}
              onClick={() => setModalCancel(true)}
            >
              Hủy phiếu
            </Button>
          </Grid>
        );
      }
    }
  };
  const activeStep  = () => {
    if(detailFulfillment.shippingStatus===0){
      return 0;
    }else if(detailFulfillment.shippingStatus===1){
      return 1;
    } else if(detailFulfillment.shippingStatus===3){
      return 2;
    }else if(detailFulfillment.shippingStatus===4){
      return 3;
    }else if(detailFulfillment.shippingStatus===6){
      return 3;
    }
  }
const stepper  = () => {
  if(detailFulfillment?.shippingStatus === 6){
      return listStepper()
  }
  if(detailFulfillment?.shippingStatus !== 6 && detailFulfillment?.shippingMethod === 1){
    return ListStepperShipingNow
  }
  if(detailFulfillment?.shippingStatus !== 6 && detailFulfillment?.shippingMethod !== 1){
    return ListStepperSuccess
  }
}
  return (
    <div>
    <div
      className={`header-add-product ${miniActive ? 'w-80' : 'w-260'}`}
      style={{ transition: 'width 300ms' }}
    >
      <div
        className={`button-header ${
          btnFoot ? 'd-none-custom' : 'd-block-custom'
        }`}
      >
        <div className='col-lg-12 col-sm-12 col-md-12'>
          <div className='col-lg-12 col-sm-12 col-md-12 text-right'>
          {ButtonAction()}
          </div>
        </div>
      </div>
    </div>
    <Grid className={classes.root}>
      <ModalCancel
        modal={modalCancel}
        setModal={setModalCancel}
        id={match.params.id}
      ></ModalCancel>
      <ModalHandOver
        modal={modalHandOver}
        setModal={setModalHandOver}
        idFulfillment={match.params.id}
        idShipper={idShipper}
        status={detailFulfillment.shippingMethod?detailFulfillment.shippingMethod:0}
      ></ModalHandOver>

      <Grid></Grid>
      <Grid container>
        <Grid item md={4} lg={4}>
          {props.match.params.idC > 0? (
          <NavLink to={`/admin/customerDetail/${props.match.params.idC}`}>
            <ChevronLeftIcon />
            Chi tiết khách hàng
          </NavLink>)
          :
          (<NavLink to={"/admin/orders-list"}>
            <ChevronLeftIcon />
            Danh sách phiếu giao hàng
          </NavLink>)}         
          <Grid className='d-flex'>
            <h3 className={classes.title}>{detailFulfillment.code}</h3>
            <h5
            style={{
              height: 25,
              marginTop: 30,
              marginLeft: 10,
              fontSize: 14,
              fontWeight: 400,
            }}
          >
            {convertMilisecondToDateTime(detailFulfillment.createdOn)}
          </h5>
          </Grid>
        </Grid>
        <Grid item md={1} lg={2}>
          {" "}
        </Grid>
        <Grid item md={7} lg={6}>
          <Stepper
            listLabel={stepper()}
            activeStep={detailFulfillment?.shippingMethod===1?activeStep():detailFulfillment?.shippingStatus}
          ></Stepper>
        </Grid>
      </Grid>
      <GridContainer>
        <GridItem md={8} lg={8}>
          <Grid container spacing={3}>
            <Grid item md={6} style={{ paddingBottom: 0 }}>
              <Card style={{ marginBottom: 0 }}>
                <CardHeader>
                  <h4 className={classes.title}>Thông tin khách hàng </h4>{" "}
                </CardHeader>

                <Grid>
                  <Grid className={classes.cardContent}>
                    <Grid style={{ display: "flex" }}>
                      <img
                        src={imgCustomer}
                        alt=""
                        height="40"
                        width="40"
                        style={{ marginRight: 15 }}
                      ></img>
                      <Grid className={classes.jss2}>
                        <Typography variant="body1">
                        {detailFulfillment.shippingFrom?.name}
                        </Typography>
                        <Typography variant="body1">
                        {detailFulfillment.shippingFrom?.phone}
                        </Typography>
                      </Grid>
                      <Grid className={classes.jss3}></Grid>
                    </Grid>
                    <Grid className={classes.jss1}>
                      <Typography variant="body1">Địa chỉ nhận hàng</Typography>
                      <Typography variant="body1">
                       {detailFulfillment.shippingFrom?.phone}
                      </Typography>
                      <Typography variant="body1" style={{ height: 50 }}>
                        {detailFulfillment.shippingFrom?.address ? detailFulfillment.shippingFrom?.address+ " ," :''}
                        {detailFulfillment.shippingFrom?.ward ? detailFulfillment.shippingFrom?.ward+ " ," :''}
                        {detailFulfillment.shippingFrom?.district ? detailFulfillment.shippingFrom?.district+ " ," :''}
                        {detailFulfillment.shippingFrom?.province ? detailFulfillment.shippingFrom?.province :''}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid item md={6} style={{ paddingBottom: 0 }}>
              <Card>
                <CardHeader>
                  <h4 className={classes.title}>Thông tin người nhận hàng</h4>
                </CardHeader>
                <Grid>
                  <Grid className={classes.cardContent}>
                    <Grid style={{ display: "flex" }}>
                      <img
                        src={imgCustomer}
                        alt=""
                        height="40"
                        width="40"
                        style={{ marginRight: 15 }}
                      ></img>
                      <Grid className={classes.jss2}>
                        <Typography variant="body1">
                        {detailFulfillment.shippingTo?.name}
                        </Typography>
                        <Typography variant="body1">
                        {detailFulfillment.shippingTo?.phone}
                        </Typography>
                      </Grid>
                      <Grid className={classes.jss3}></Grid>
                    </Grid>
                    <Grid className={classes.jss1}>
                      <Typography variant="body1">Địa chỉ giao hàng</Typography>
                      <Typography variant="body1">
                       {detailFulfillment.shippingTo?.phone}
                      </Typography>
                      <Typography variant="body1" style={{ height: 50 }}>
                        {detailFulfillment.shippingTo?.address ? detailFulfillment.shippingTo?.address+ " ," :''}
                        {detailFulfillment.shippingTo?.ward ? detailFulfillment.shippingTo?.ward+ " ," :''}
                        {detailFulfillment.shippingTo?.district ? detailFulfillment.shippingTo?.district+ " ," :''}
                        {detailFulfillment.shippingTo?.province ? detailFulfillment.shippingTo?.province :''}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>

          <Card>
            <CardHeader>
              <h4 className={classes.title}>Thông tin sản phẩm</h4>
            </CardHeader>

            <Grid className={classes.cardContent}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Mã sẩn phẩm</TableCell>
                    <TableCell align="left">Tên sản phẩm</TableCell>
                    <TableCell align="center">Khối lượng</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell align="center">Đơn giá</TableCell>
                    <TableCell align="right">Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detailFulfillment?.fulfillmentDetailDTOList?.map((row) => (
                    <TableRow key={row}>
                      <TableCell component="th" scope="row">
                        {row?.productDTO?.code}
                      </TableCell>
                      <TableCell align="left">
                        {row?.productDTO?.name}
                      </TableCell>
                      <TableCell align="center">
                        <NumberFormat
                          value={row?.productDTO?.mass  +" g"}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <NumberFormat
                          value={row?.quantity}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </TableCell>
                      <TableCell align="center">
                     
                        <NumberFormat
                          value={row?.price  +" đ"}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <NumberFormat
                          value={row?.price * row?.quantity +" đ"}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Grid container className={classes.jss7}>
                <Grid item md={7}></Grid>
                <Grid item md={5}>
                  <Grid className={classes.jss5}>
                    <Typography variant="body1">Giá trị đơn hàng</Typography>
                    <Typography variant="body1">
                      <NumberFormat
                        value={detailFulfillment.totalMoney}
                        displayType={"text"}
                        thousandSeparator={true}
                        suffix={" đ"}
                      />
                    </Typography>
                  </Grid>{" "}
                  <Grid className={classes.jss5}>
                    <Typography variant="body1">Phí giao</Typography>

                    <Typography variant="body1">
                      <NumberFormat
                        value={detailFulfillment.transportFee}
                        displayType={"text"}
                        thousandSeparator={true}
                        suffix={" đ"}
                      />
                    </Typography>
                  </Grid>
                  <Grid className={classes.jss5}>
                    <Typography variant="body1">Tiền thu hộ</Typography>
                    <Typography variant="body1">
                      <NumberFormat
                        value={detailFulfillment.codMoney}
                        displayType={"text"}
                        thousandSeparator={true}
                        suffix={" đ"}
                      />
                    </Typography>
                  </Grid>
                  <Grid className={classes.jss5} style={{ paddingBottom: 20 }}>
                    <Typography variant="body1">Tổng COD thu</Typography>
                    <Typography variant="body1">
                      <NumberFormat
                        value={
                          detailFulfillment.shippingPaymentObject === 0
                            ? detailFulfillment.codMoney +
                              detailFulfillment.transportFee
                            : detailFulfillment.codMoney
                        }
                        displayType={"text"}
                        thousandSeparator={true}
                        suffix={" đ"}
                      />
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>

          <Card>
            <CardHeader>
              <h4 className={classes.title}>
                Chi tiết trạng thái phiếu giao hàng
              </h4>
            </CardHeader>
            <Grid className={classes.cardContent}>
              {detailFulfillment?.fulfillmentTrackingEntities?.map(
                (row, index) => (
                  <CusTimelineItem style={{ minHeight: 50 }}>
                    <TimelineSeparator>
                      <TimelineDot />
                      {index ===
                      detailFulfillment?.fulfillmentTrackingEntities?.length -
                        1 ? (
                        <span></span>
                      ) : (
                        <TimelineConnector />
                      )}
                    </TimelineSeparator>
                    <TimelineContent style={{ fontWeight: 400 }}>
                      <div style={{ width: '100%', display: 'flex' }}>
                        <div>
                          <span style={{ fontSize: '15px', fontWeight: 500 }}>
                            <span>{row.action}</span>
                          </span>
                        </div>
                        <div style={{ marginLeft: 10 }}>
                          <span>{convertMilisecondToDateTime(row.createdOn)}</span>
                        </div>
                      </div>
                      <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: '40%', marginTop: 15 }}>
                          <span>
                            <span>Nhân viên thao tác</span>: {row.name}
                          </span>
                        </div>
                        <div style={{ width: '40%', marginTop: 15 }}>
                          <span>
                            {row.note ? "Lý do giao lại: " + row.note : '' }
                            
                          </span>
                        </div>
                      </div>
                      <span style={{ paddingLeft: 20 }}></span>
                    </TimelineContent>
                  </CusTimelineItem>
                )
              )}
            </Grid>
          </Card>
        </GridItem>
        <GridItem md={4} lg={4}>
          <Card item md={12}>
              <CardHeader className='d-flex'>
                <h4 className={classes.product_title}>Thông tin phiếu </h4>
               {detailFulfillment.shippingStatus===4? <p
                  style={{marginLeft:40}}
                  className={
                    detailFulfillment.accounting_status
                      ? 'status-accounting'
                      : 'non-status-accounting'
                  }
                >
                  {detailFulfillment.accounting_status ? 'Đã Đối soát' : 'Chưa Đối soát'}
                </p>:''}
                </CardHeader>
            <Grid className={classes.cardContent}>
              <p>
                <label>Mã phiếu giao: </label>
                <i className={classes.spanDetailFulfillment}>
                  {detailFulfillment.code}
                </i>
              </p>
              <p>
                <label>Người tạo phiếu: </label>
                <i className={classes.spanDetailFulfillment}>
                  {detailFulfillment?.userResDTO?.fullName}
                </i>
              </p>

              <p>
                <label>Ngày giao hàng: </label>
                <i className={classes.spanDetailFulfillment}>
                  {convertMilisecondToDateTime(detailFulfillment.deliveryDate)}
                </i>
              </p>
              <label>Ghi chú: </label>
              <i
                className={classes.spanDetailFulfillment}
                style={{ fontWeight: 400, color: "#000000" }}
              >
                {detailFulfillment?.description
                  ? detailFulfillment?.description
                  : "(Không có)"}
              </i>
            </Grid>
          </Card>
          <Card>
            <CardHeader>
              <h4 className={classes.title}>Nhân viên giao </h4>
            </CardHeader>
            <Grid className={classes.cardContent}>
             
              <Autocomplete
                  size="small"
                  noOptionsText={
                    <p style={{ textAlign: "center" }}>
                      không có kết quả phù hợp
                    </p>
                  }
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setIdShipper(newValue.id);
                      addItemShipper(newValue)
                    } else {
                      setIdShipper("");
                    }
                  }}
                  renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <img
                        src={imgShipper}
                        alt=""
                        height="40"
                        width="40"
                        style={{ marginRight: 15 }}
                      ></img>

                      <div className={classes.text}>
                        {option.name}
                        {option.name ? <br /> : ""}
                        Số đơn hàng đang giao: {option.count}
                        <span style={{ fontSize: 20 }}>{option.noShipper}</span>
                      </div>
                    </React.Fragment>
                  )}
                  value={itemShipper}
                  options={listShipper.shipperDTOList}
                  open={open}
                  onOpen={() => {
                    setOpen(true);
                  }}
                  onClose={() => {
                    setOpen(false);
                  }}
                  disabled={(detailFulfillment.shippingStatus===1 || detailFulfillment.shippingStatus>=3)?true:false}
                  loading={loading}
                  filterSelectedOptions
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <CusTextField
                      {...params}
                      fullWidth
                     
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon style={{ color: "#637381" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <React.Fragment>
                            {loading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                      variant="outlined"
                      placeholder="Tìm kiếm nhân viên giao hàng..."
                    />
                  )}
                />
            </Grid>
          </Card>
          <Card>
            <CardHeader>
              <h4 className={classes.title}>Bên thanh toán phí vẫn chuyển</h4>
            </CardHeader>
            <Grid className={classes.cardContent}>
              <RadioGroup
                aria-label="quiz"
                name="shippingPaymentObject"
                value={
                  detailFulfillment.shippingPaymentObject
                    ? detailFulfillment.shippingPaymentObject
                    : 0
                }
              >
                 <FormControlLabel
                  value={1}
                  control={
                    <Radio
                      color="primary"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  }
                  disabled
                  label="Người nhận hàng"
                />
                <FormControlLabel
                  value={0}
                  control={
                    <Radio
                      color="primary"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  }
                  disabled
                  label="Khách hàng"
                />

               
              </RadioGroup>
            </Grid>
          </Card>
          <Card>
              <CardHeader style={{ paddingBottom: 0 }}>
                <h4 className={classes.title} style={{ paddingBottom: 0 }}>
                  Hình thức giao hàng
                </h4>
              </CardHeader>
              <Grid
                className={classes.cardContent}
                style={{ paddingBottom: 0 }}
              >
                <RadioGroup
                  aria-label="quiz"
                  name="shippingMethod"
                  value={
                    detailFulfillment.shippingMethod
                      ? detailFulfillment.shippingMethod
                      : 0
                  }  
                >
                  <FormControlLabel
                    value={0}
                    disabled
                    control={<Radio color="primary" />}
                    label="Chuyển sản phẩm về kho rồi đi giao"
                  />
                  <FormControlLabel
                    value={1}
                    disabled
                    control={<Radio color="primary" />}
                    label="Đi giao luôn"
                  />
                </RadioGroup>
              </Grid>
            </Card>
          
        </GridItem>

        <hr
          style={{
            borderTop: "1px solid",
            width: "97%",
            borderColor: "rgba(0, 0, 0, 0.23)",
          }}
        ></hr>

        {ButtonAction()}
      </GridContainer>
    </Grid>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    detailFulfillment: state.order.detailFulfillment,
    listShipper: state.shipper.listShipper,
    itemShipper: state.shipper.itemShipper,
    miniActive: state.ui.miniActive,
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchFulfillmentById: (id) => {
      dispatch(fetchFulfillmentById(id));
    },
    receiveFulfillmentThunk: (idFulfillment, idShipper) => {
      dispatch(receiveFulfillmentThunk(idFulfillment, idShipper));
    },
    deliverFulfillmentThunk: (idFulfillment, idShipper) => {
      dispatch(deliverFulfillmentThunk(idFulfillment, idShipper));
    },
    updateStatusFulfillmentThunk: (status, id,note) => {
      dispatch(updateStatusFulfillmentThunk(status, id,note));
    },
    fetchListShipper: (page, limit) => {
      dispatch(fetchListShipperThunk(page, limit));
    },
    addItemShipper:(data)=>{
      dispatch(addItemShipper(data))
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Update);
