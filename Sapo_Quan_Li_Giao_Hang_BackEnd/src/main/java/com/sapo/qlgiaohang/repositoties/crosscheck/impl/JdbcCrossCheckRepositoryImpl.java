package com.sapo.qlgiaohang.repositoties.crosscheck.impl;

import com.sapo.qlgiaohang.dto.acounting.DebtToPayDTO;
import com.sapo.qlgiaohang.dto.acounting.FulfillmentAccountingDTO;
import com.sapo.qlgiaohang.dto.crosscheck.FulfillmentCrossCheckDTO;
import com.sapo.qlgiaohang.dto.crosscheck.ShipperCrossCheckDTO;
import com.sapo.qlgiaohang.repositoties.crosscheck.JdbcCrossCheckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class JdbcCrossCheckRepositoryImpl implements JdbcCrossCheckRepository {

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public JdbcCrossCheckRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<ShipperCrossCheckDTO> findShipper(String value, int page) {
        String query = "select s.* , u.full_name as name from shipper s inner join user u on s.user_id = u.id where u.full_name like ? or phone like ? limit ?,5 ";
        return jdbcTemplate.query(query, new Object[]{value, value, page}, new BeanPropertyRowMapper<>(ShipperCrossCheckDTO.class));
    }

    @Override
    public Long findTotalShipper(String value) {
        String query = "select count(*) from shipper s inner join user u on s.user_id = u.id where u.full_name like ? or phone like ?";
        return jdbcTemplate.queryForObject(query, new Object[]{value, value}, Long.class);
    }

    @Override
    public List<DebtToPayDTO> DebtOfShipper(Long shipperId) {
        String query = "SELECT SUM(cod_money) AS total_cod, SUM(transport_fee) AS total_transport_fee,shipping_payment_object AS person_pay_ship\n" +
                " FROM fulfillment WHERE shipper_id = ? and shipping_status = 4 \n" +
                " AND payment_status = 0 and cross_check_id is null GROUP BY person_pay_ship";
        return jdbcTemplate.query(query, new Object[]{shipperId}, new BeanPropertyRowMapper<>(DebtToPayDTO.class));
    }

    @Override
    public Long DebtOfShipperCrossCheck(Long shipperId) {
        String query = "select sum(total_money) - sum(money_paid) from cross_check where shipper_id = ?";
        return jdbcTemplate.queryForObject(query, new Object[]{shipperId}, Long.class);
    }

    @Override
    public List<FulfillmentCrossCheckDTO> getFulfillment(String value, Long shipperId, int page) {
        String query = "SELECT f.id,f.code,cod_money,transport_fee,shipping_payment_object as person_pay_ship,c.name " +
                "from fulfillment f INNER JOIN customer c " +
                "ON f.customer_id = c.id " +
                "where shipper_id = ? and payment_status = 0 and shipping_status = 4 AND (f.CODE LIKE ? OR NAME LIKE ?) AND f.cross_check_id is null LIMIT ?,5 ";
        return jdbcTemplate.query(query, new Object[]{shipperId, value, value, page}, new BeanPropertyRowMapper<>(FulfillmentCrossCheckDTO.class));
    }

    @Override
    public Long getTotalFulfillment(String value, Long shipperId) {
        String query = "SELECT COUNT(f.id) from fulfillment f inner join customer c on f.customer_id = c.id" +
                " where shipper_id = ? and payment_status = 0 AND shipping_status = 4 " +
                "AND (f.CODE LIKE ? OR c.name LIKE ?) AND cross_check_id is null ";
        System.out.println(query);
        return jdbcTemplate.queryForObject(query, new Object[]{shipperId, value, value}, Long.class);
    }

    @Override
    public List<FulfillmentCrossCheckDTO> getFulfillmentOfCross(Long id, String value, int page) {
        String query = "SELECT f.id,f.code,cod_money,transport_fee,shipping_payment_object as person_pay_ship , cus.name\n" +
                "from fulfillment f INNER JOIN cross_check c\n" +
                "ON f.cross_check_id = c.id inner join customer cus on f.customer_id = cus.id \n" +
                "where f.cross_check_id= ? and (f.code like ? or name like ?) limit ?,5";
        return jdbcTemplate.query(query, new Object[]{id, value, value, page}, new BeanPropertyRowMapper<>(FulfillmentCrossCheckDTO.class));
    }

    @Override
    public Long getTotalFulfillmentOfCross(Long id, String value) {
        String query = "SELECT count(f.id)\n" +
                "from fulfillment f inner  join customer c on f.customer_id = c.id " +
                "where f.cross_check_id= ? and (f.code like ? or c.name like ?)";
        return jdbcTemplate.queryForObject(query, new Object[]{id, value, value}, Long.class);
    }
}
