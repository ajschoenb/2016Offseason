var mysql = require("mysql");
var fs = require("fs");

function rest_router(router, connection) {
  var self = this;
  self.handleRoutes(router, connection);
}

rest_router.prototype.handleRoutes = function(router, connection) {
  var most_recent = 0;
  var query_bool = 0;
  var query_res = "";

  router.get("/", function(req, res) {
    var score_list, score_sql, team_list, team_sql;
    var team_list = "";
    var score_list = "";
    var team_sql = "SELECT * FROM teams";
    connection.query(team_sql, function(err, rows, fields) {
      for(var x in rows) {
        team_list += "<tr class=\"clickable-row\" data-href=\"/team/" + rows[x].team_number + "\"><td>" + rows[x].team_number + "</td><td>" + rows[x].team_name + "</td></tr>";
      }
    });
    var score_sql = "SELECT * FROM teams ORDER BY avg_contrib_score DESC, team_number ASC";
    connection.query(score_sql, function(err, rows, fields) {
      for(var x in rows) {
        score_list += "<tr class=\"clickable-row\" data-href=\"/team/" + rows[x].team_number + "\"><td>" + rows[x].team_number + "</td><td>" + rows[x].avg_contrib_score + "</td><td>" + rows[x].avg_driver_rating + "</td></tr>";
      }
      res.render("pages/index", {
        team_list: team_list,
        score_list: score_list
      });
    });
  });
  router.get("/export", function(req, res) {
    var teams_sql = "SELECT * FROM teams";
    var filename = "teams.csv";
    var data = "";
    connection.query(teams_sql, function(err, rows, fields) {
      for(var p in rows[0])
      {
        data += p + ", ";
      }
      data = data.slice(0, data.length - 2); // Remove the extra comma
      data += "\n";
      for(var i in rows)
      {
        for(var p in rows[i])
        {
          data += rows[i][p] + ", ";
        }
        data = data.slice(0, data.length - 2); // Remove the extra comma
        data += "\n";
      }
      fs.writeFile(filename, data, function(err) {
        console.log(err ? err : "File saved to " + __dirname);
      });
      res.download(__dirname + "/teams.csv");
    });
  });
  router.get("/data-entry", function(req, res) {
    var message = "";
    if(most_recent == -1)
      message = "<div class=\"alert alert-danger\" role=\"alert\"><p><b>Oh snap</b>, looks like this is a duplicate entry. Data not queried.</p></div>";
    else if(most_recent != -1 && most_recent != 0)
      message = "<div class=\"alert alert-success\" role=\"alert\"><p>Data for <b>"+ most_recent +"</b> has been <b>successfully</b> entered.</p></div>";
    res.render("pages/data_entry", {
      message: message
    });
  });
  router.get("/sql", function(req, res) {
    var message = "";
    if(query_bool == -1)
      message = "<div class=\"alert alert-danger\" role=\"alert\"><p><b>Oh snap</b>, looks like there's a mistake in your query. Data not queried.</p></div>";
    else if(query_bool != -1 && query_bool != 0)
      message = "<div class=\"alert alert-success\" role=\"alert\"><p>Data has been <b>successfully</b> queried.</p></div>";
    res.render("pages/sql", {
      message: message,
      result: query_res
    });
    if(query_bool == 1)
    {
      query_res = "";
      query_bool = 0;
    }
  });
  router.post("/query", function(req, res) {
    var sql = req.body.query;
    query_res = "";
    connection.query(sql, function(err, rows, fields) {
      if(err)
      {
        console.log(err);
        query_bool = -1;
      }
      else
      {
        query_bool = 1;
        query_res += "<tr>";
        for(var p in rows[0])
        {
          query_res += "<th>" + p + "</th>";
        }
        for(var i in rows)
        {
          query_res += "</tr><tr>";
          for(var p in rows[i])
          {
            query_res += "<td>" + rows[i][p] + "</td>";
          }
          query_res += "</tr>";
        }
      }
      res.redirect("/sql");
    });
  });
  router.post("/parse-data", function(req, res) {
    var match_number = Number(req.body.match_num);
    var team_number = Number(req.body.team_num);
    var lb_success = Number(req.body.lb_success);
    var lb_fail = Number(req.body.lb_fail);
    var lb_attempts = lb_success + lb_fail;
    var lb_rating = Number(req.body.lb_rating);
    var lb_assist = Number(req.body.lb_assist);
    var lb_stuck = Number(req.body.lb_stuck);
    var lb_success_tmp = lb_success;
    if(lb_success > 2)
      lb_success_tmp = 2;
    var a1_success = Number(req.body.a1_success);
    var a1_fail = Number(req.body.a1_fail);
    var a1_attempts = a1_success + a1_fail;
    var a1_rating = Number(req.body.a1_rating);
    var a1_assist = Number(req.body.a1_assist);
    var a1_stuck = Number(req.body.a1_stuck);
    var a1_success_tmp = a1_success;
    if(a1_success > 2)
      a1_success_tmp = 2;
    var a2_success = Number(req.body.a2_success);
    var a2_fail = Number(req.body.a2_fail);
    var a2_attempts = a2_success + a2_fail;
    var a2_rating = Number(req.body.a2_rating);
    var a2_assist = Number(req.body.a2_assist);
    var a2_stuck = Number(req.body.a2_stuck);
    var a2_success_tmp = a2_success;
    if(a2_success > 2)
      a2_success_tmp = 2;
    var b1_success = Number(req.body.b1_success);
    var b1_fail = Number(req.body.b1_fail);
    var b1_attempts = b1_success + b1_fail;
    var b1_rating = Number(req.body.b1_rating);
    var b1_assist = Number(req.body.b1_assist);
    var b1_stuck = Number(req.body.b1_stuck);
    var b1_success_tmp = b1_success;
    if(b1_success > 2)
      b1_success_tmp = 2;
    var b2_success = Number(req.body.b2_success);
    var b2_fail = Number(req.body.b2_fail);
    var b2_attempts = b2_success + b2_fail;
    var b2_rating = Number(req.body.b2_rating);
    var b2_assist = Number(req.body.b2_assist);
    var b2_stuck = Number(req.body.b2_stuck);
    var b2_success_tmp = b2_success;
    if(b2_success > 2)
      b2_success_tmp = 2;
    var c1_success = Number(req.body.c1_success);
    var c1_fail = Number(req.body.c1_fail);
    var c1_attempts = c1_success + c1_fail;
    var c1_rating = Number(req.body.c1_rating);
    var c1_assist = Number(req.body.c1_assist);
    var c1_stuck = Number(req.body.c1_stuck);
    var c1_success_tmp = c1_success;
    if(c1_success > 2)
      c1_success_tmp = 2;
    var c2_success = Number(req.body.c2_success);
    var c2_fail = Number(req.body.c2_fail);
    var c2_attempts = c2_success + c2_fail;
    var c2_rating = Number(req.body.c2_rating);
    var c2_assist = Number(req.body.c2_assist);
    var c2_stuck = Number(req.body.c2_stuck);
    var c2_success_tmp = c2_success;
    if(c2_success > 2)
      c2_success_tmp = 2;
    var d1_success = Number(req.body.d1_success);
    var d1_fail = Number(req.body.d1_fail);
    var d1_attempts = d1_success + d1_fail;
    var d1_rating = Number(req.body.d1_rating);
    var d1_assist = Number(req.body.d1_assist);
    var d1_stuck = Number(req.body.d1_stuck);
    var d1_success_tmp = d1_success;
    if(d1_success > 2)
      d1_success_tmp = 2;
    var d2_success = Number(req.body.d2_success);
    var d2_fail = Number(req.body.d2_fail);
    var d2_attempts = d2_success + d2_fail;
    var d2_rating = Number(req.body.d2_rating);
    var d2_assist = Number(req.body.d2_assist);
    var d2_stuck = Number(req.body.d2_stuck);
    var d2_success_tmp = d2_success;
    if(d2_success > 2)
      d2_success_tmp = 2;
    var floor_intakes = Number(req.body.floor_intakes);
    var hp_intakes = Number(req.body.hp_intakes);
    var hp_missed = Number(req.body.hp_missed);
    var high_made = Number(req.body.high_made);
    var high_missed = Number(req.body.high_missed);
    var low_made = Number(req.body.low_made);
    var low_missed = Number(req.body.low_missed);
    var forced_miss = Number(req.body.forced_miss);
    var knockouts = Number(req.body.knockouts);
    var driver_rating = Number(req.body.driver_rating);
    var bully_rating = Number(req.body.bully_rating);
    var hang_success = Number(req.body.hang_success);
    var hang_fail = Number(req.body.hang_fail);
    var challenge_success = Number(req.body.challenge_success);
    var challenge_fail = Number(req.body.challenge_fail);
    var fouls = Number(req.body.fouls);
    var dead = Number(req.body.dead);
    var auto_floor_intakes = Number(req.body.auto_floor_intakes);
    var auto_defense = req.body.auto_defense;
    var auto_defense_total = Number(req.body.auto_defense_total);
    var auto_defense_reach = Number(req.body.auto_defense_reach);
    var auto_high_made = Number(req.body.auto_high_made);
    var auto_high_missed = Number(req.body.auto_high_missed);
    var auto_low_made = Number(req.body.auto_low_made);
    var auto_low_missed = Number(req.body.auto_low_missed);
    var auto_score = 10*auto_high_made + 5*auto_low_made + 2*auto_defense_reach + (auto_defense_total > 0 ? 10 : 0);
    var contrib_score = auto_score + 5*high_made + 2*low_made + 5*lb_success_tmp + 5*a1_success_tmp + 5*a2_success_tmp + 5*b1_success_tmp + 5*b2_success_tmp + 5*c1_success_tmp + 5*c2_success_tmp + 5*d1_success_tmp + 5*d2_success_tmp + 5*challenge_success + 15*hang_success;
    var match_sql = "INSERT INTO matches (team_number, match_number, a1_successful, a2_successful, b1_successful, b2_successful," +
      "c1_successful, c2_successful, d1_successful, d2_successful, lb_successful, a1_failed, a2_failed, b1_failed, b2_failed, c1_failed, c2_failed, d1_failed," +
      "d2_failed, lb_failed, a1_attempts, a2_attempts, b1_attempts, b2_attempts, c1_attempts, c2_attempts, d1_attempts, d2_attempts, lb_attempts," +
      "a1_total, a2_total, b1_total, b2_total, c1_total, c2_total, d1_total, d2_total, lb_total, a1_assists, a2_assists, b1_assists, b2_assists," +
      "c1_assists, c2_assists, d1_assists, d2_assists, lb_assists, a1_stuck, a2_stuck, b1_stuck, b2_stuck, c1_stuck, c2_stuck, d1_stuck, d2_stuck," +
      "lb_stuck, auton_floor_intake, auton_defense_crossed, auton_defense_total, auton_high, auton_high_missed, auton_low, auton_low_missed," +
      "auton_reach, auton_score, tele_high_made, tele_high_missed, tele_forced_miss, tele_low_made, tele_low_missed, tele_hp_high_intake," +
      "tele_hp_high_intake_dropped, tele_floor_intake, tele_knock_out, tele_hang, tele_hang_failed, tele_challenge, tele_challenge_failed," +
      "driver_rating, bully_rating, fouls_noticed, dead, contributed_score) VALUES (" + team_number + ", " + match_number +
      ", " + a1_success + ", " + a2_success + ", " + b1_success + ", " + b2_success + ", " + c1_success + ", " + c2_success + ", " + d1_success + ", " + d2_success +
      ", " + lb_success + ", " + a1_fail + ", " + a2_fail + ", " + b1_fail + ", " + b2_fail + ", " + c1_fail + ", " + c2_fail + ", " + d1_fail +
      ", " + d2_fail + ", " + lb_fail + ", " + a1_attempts + ", " + a2_attempts + ", " + b1_attempts + ", " + b2_attempts +
      ", " + c1_attempts + ", " + c2_attempts + ", " + d1_attempts + ", " + d2_attempts + ", " + lb_attempts + ", " + a1_rating + ", " + a2_rating + ", " + b1_rating +
      ", " + b2_rating + ", " + c1_rating + ", " + c2_rating + ", " + d1_rating + ", " + d2_rating + ", " + lb_rating +
      ", " + a1_assist + ", " + a2_assist + ", " + b1_assist + ", " + b2_assist + ", " + c1_assist + ", " + c2_assist + ", " + d1_assist + ", " + d2_assist +
      ", " + lb_assist + ", " + a1_stuck + ", " + a2_stuck + ", " + b1_stuck + ", " + b2_stuck + ", " + c1_stuck + ", " + c2_stuck + ", " + d1_stuck +
      ", " + d2_stuck + ", " + lb_stuck + ", " + auto_floor_intakes + ", '" + auto_defense + "', " + auto_defense_total + ", " + auto_high_made +
      ", " + auto_high_missed + ", " + auto_low_made + ", " + auto_low_missed + ", " + auto_defense_reach + ", " + auto_score + ", " + high_made +
      ", " + high_missed + ", " + forced_miss + ", " + low_made + ", " + low_missed + ", " + hp_intakes + ", " + hp_missed + ", " + floor_intakes +
      ", " + knockouts + ", " + hang_success + ", " + hang_fail + ", " + challenge_success + ", " + challenge_fail + ", " + driver_rating +
      ", " + bully_rating + ", " + fouls + ", " + dead + ", " + contrib_score + ")";
      connection.query(match_sql, function(err) {
        if(err) {
          most_recent = -1;
          console.log(err);
          updateTeams(team_number);
        }
        else {
          most_recent = team_number;
          updateTeams(team_number);
        }
        res.redirect("/data-entry");
      });
  });
  router.get("/team/:team_number", function(req, res) {
    updateTeams(req.params.team_number);
    var team_number = req.params.team_number;
    var team_name = "";
    var num_matches = 0;
    var avg_auto_score = 0;
    var avg_contrib_score = 0;
    var floor_intakes = 0;
    var high_made = 0;
    var high_attempts = 0;
    var low_made = 0;
    var low_attempts = 0;
    var auto_high_made = 0;
    var auto_high_attempts = 0;
    var auto_low_made = 0;
    var auto_low_attempts = 0;
    var auto_reaches = 0;
    var tot_hang = 0;
    var tot_hang_attempts = 0;
    var tot_challenge = 0;
    var tot_challenge_attempts = 0;
    var defense_success = [];
    var defense_attempts = [];
    var defense_stuck = [];
    var defense_assist = [];
    var defense_speed = [];
    var auto_defense_success = [];
    var auto_defense_attempts = [];
    var knockouts = 0;
    var avg_driver_rating = 0;
    var avg_bully_rating = 0;
    var fouls = 0;
    var deads = 0;
    var team_sql = "SELECT * FROM teams WHERE team_number=" + team_number;
    connection.query(team_sql, function(err, rows, fields) {
      team_name = rows[0].team_name;
      num_matches = rows[0].num_matches;
      avg_auto_score = rows[0].avg_auton_score;
      avg_contrib_score = rows[0].avg_contrib_score;
      floor_intakes = rows[0].avg_floor_intakes;
      high_made = rows[0].avg_high_made;
      high_attempts = rows[0].avg_high_attempts;
      low_made = rows[0].avg_low_made;
      low_attempts = rows[0].avg_low_attempts;
      auto_high_made = rows[0].auton_high_made;
      auto_high_attempts = rows[0].auton_high_attempts;
      auto_low_made = rows[0].auton_low_made;
      auto_low_attempts = rows[0].auton_low_attempts;
      auto_reaches = rows[0].auton_reaches_total;
      tot_hang = rows[0].total_hangs;
      tot_hang_attempts = rows[0].total_hang_attempts;
      tot_challenge = rows[0].total_challenges;
      tot_challenge_attempts = rows[0].total_challenge_attempts;
      defense_success[0] = rows[0].tot_a1_successful;
      defense_attempts[0] = rows[0].tot_a1_attempts;
      defense_stuck[0] = rows[0].tot_a1_stuck;
      defense_assist[0] = rows[0].tot_a1_assisted;
      defense_speed[0] = rows[0].avg_a1_speed;
      defense_success[1] = rows[0].tot_a2_successful;
      defense_attempts[1] = rows[0].tot_a2_attempts;
      defense_stuck[1] = rows[0].tot_a2_stuck;
      defense_assist[1] = rows[0].tot_a2_assisted;
      defense_speed[1] = rows[0].avg_a2_speed;
      defense_success[2] = rows[0].tot_b1_successful;
      defense_attempts[2] = rows[0].tot_b1_attempts;
      defense_stuck[2] = rows[0].tot_b1_stuck;
      defense_assist[2] = rows[0].tot_b1_assisted;
      defense_speed[2] = rows[0].avg_b1_speed;
      defense_success[3] = rows[0].tot_b2_successful;
      defense_attempts[3] = rows[0].tot_b2_attempts;
      defense_stuck[3] = rows[0].tot_b2_stuck;
      defense_assist[3] = rows[0].tot_b2_assisted;
      defense_speed[3] = rows[0].avg_b2_speed;
      defense_success[4] = rows[0].tot_c1_successful;
      defense_attempts[4] = rows[0].tot_c1_attempts;
      defense_stuck[4] = rows[0].tot_c1_stuck;
      defense_assist[4] = rows[0].tot_c1_assisted;
      defense_speed[4] = rows[0].avg_c1_speed;
      defense_success[5] = rows[0].tot_c2_successful;
      defense_attempts[5] = rows[0].tot_c2_attempts;
      defense_stuck[5] = rows[0].tot_c2_stuck;
      defense_assist[5] = rows[0].tot_c2_assisted;
      defense_speed[5] = rows[0].avg_c2_speed;
      defense_success[6] = rows[0].tot_d1_successful;
      defense_attempts[6] = rows[0].tot_d1_attempts;
      defense_stuck[6] = rows[0].tot_d1_stuck;
      defense_assist[6] = rows[0].tot_d1_assisted;
      defense_speed[6] = rows[0].avg_d1_speed;
      defense_success[7] = rows[0].tot_d2_successful;
      defense_attempts[7] = rows[0].tot_d2_attempts;
      defense_stuck[7] = rows[0].tot_d2_stuck;
      defense_assist[7] = rows[0].tot_d2_assisted;
      defense_speed[7] = rows[0].avg_d2_speed;
      defense_success[8] = rows[0].tot_lb_successful;
      defense_attempts[8] = rows[0].tot_lb_attempts;
      defense_stuck[8] = rows[0].tot_lb_stuck;
      defense_assist[8] = rows[0].tot_lb_assisted;
      defense_speed[8] = rows[0].avg_lb_speed;
      auto_defense_success[0] = rows[0].auton_a1;
      auto_defense_attempts[0] = rows[0].auton_a1_attempts;
      auto_defense_success[1] = rows[0].auton_a2;
      auto_defense_attempts[1] = rows[0].auton_a2_attempts;
      auto_defense_success[2] = rows[0].auton_b1;
      auto_defense_attempts[2] = rows[0].auton_b1_attempts;
      auto_defense_success[3] = rows[0].auton_b2;
      auto_defense_attempts[3] = rows[0].auton_b2_attempts;
      auto_defense_success[4] = rows[0].auton_c1;
      auto_defense_attempts[4] = rows[0].auton_c1_attempts;
      auto_defense_success[5] = rows[0].auton_c2;
      auto_defense_attempts[5] = rows[0].auton_c2_attempts;
      auto_defense_success[6] = rows[0].auton_d1;
      auto_defense_attempts[6] = rows[0].auton_d1_attempts;
      auto_defense_success[7] = rows[0].auton_d2;
      auto_defense_attempts[7] = rows[0].auton_d2_attempts;
      auto_defense_success[8] = rows[0].auton_lb;
      auto_defense_attempts[8] = rows[0].auton_lb_attempts;
      knockouts = rows[0].total_knockouts;
      avg_driver_rating = rows[0].avg_driver_rating;
      avg_bully_rating = rows[0].avg_bully_rating;
      fouls = rows[0].total_fouls;
      deads = rows[0].tot_dead;
    });

    var no_auto_sql = "SELECT * FROM matches WHERE team_number = " + team_number + " AND auton_score = 0"
    var next_team_sql = "SELECT team_number FROM teams WHERE team_number > " + team_number;
    var prev_team_sql = "SELECT team_number FROM teams WHERE team_number < " + team_number + " ORDER BY team_number DESC";
    var first_team_sql = "SELECT team_number FROM teams";
    var last_team_sql = "SELECT team_number FROM teams ORDER BY team_number DESC";
    var charts_sql = "SELECT * FROM matches WHERE team_number=" + team_number + " ORDER BY match_number";
    var trend_labels = "";
    var trend_data = "";
    var high_goal_trend = "";
    var no_autos = 0;
    var next_team = 0;
    var prev_team = 0;
    var first_team = 0;
    var last_team = 0;
    connection.query(no_auto_sql, function(err, rows, fields) {
      for(var x in rows) {
        no_autos++;
      }
    });
    connection.query(first_team_sql, function(err, rows, fields) {
      first_team = rows[0].team_number;
    });
    connection.query(last_team_sql, function(err, rows, fields) {
      last_team = rows[0].team_number;
    });
    connection.query(next_team_sql, function(err, rows, fields) {
      if (team_number == last_team)
        next_team = first_team;
      else
        next_team = rows[0].team_number;
    });
    connection.query(prev_team_sql, function(err, rows, fields) {
      if (team_number == first_team)
        prev_team = last_team;
      else
        prev_team = rows[0].team_number;
    });
    connection.query(charts_sql, function(err, rows, fields) {
      for(var x in rows)
      {
          trend_labels += rows[x].match_number + ", ";
          trend_data += rows[x].contributed_score + ", ";
          high_goal_trend += rows[x].tele_high_made + ", ";
      }

      res.render("pages/team", {
        team_number: team_number,
        team_name: team_name,
        next_team: next_team,
        previous_team: prev_team,
        avg_auto_score: avg_auto_score,
        avg_contrib_score: avg_contrib_score,
        no_autos: no_autos,
        auto_reaches: auto_reaches,
        auto_high_made: auto_high_made,
        auto_high_attempts: auto_high_attempts,
        auto_low_made: auto_low_made,
        auto_low_attempts: auto_low_attempts,
        auto_a1_success: auto_defense_success[0],
        auto_a1_attempts: auto_defense_attempts[0],
        auto_a2_success: auto_defense_success[1],
        auto_a2_attempts: auto_defense_attempts[1],
        auto_b1_success: auto_defense_success[2],
        auto_b1_attempts: auto_defense_attempts[2],
        auto_b2_success: auto_defense_success[3],
        auto_b2_attempts: auto_defense_attempts[3],
        auto_c1_success: auto_defense_success[4],
        auto_c1_attempts: auto_defense_attempts[4],
        auto_c2_success: auto_defense_success[5],
        auto_c2_attempts: auto_defense_attempts[5],
        auto_d1_success: auto_defense_success[6],
        auto_d1_attempts: auto_defense_attempts[6],
        auto_d2_success: auto_defense_success[7],
        auto_d2_attempts: auto_defense_attempts[7],
        auto_lb_success: auto_defense_success[8],
        auto_lb_attempts: auto_defense_attempts[8],
        tele_high_made: high_made,
        tele_high_attempts: high_attempts,
        tele_low_made: low_made,
        tele_low_attempts: low_attempts,
        avg_driver_rating: avg_driver_rating,
        avg_bully_rating: avg_bully_rating,
        knockouts: knockouts,
        floor_intakes: floor_intakes,
        deads: deads,
        fouls: fouls,
        a1_success: defense_success[0],
        a1_attempts: defense_attempts[0],
        a1_rating: defense_speed[0],
        a1_assist: defense_assist[0],
        a1_stuck: defense_stuck[0],
        a2_success: defense_success[1],
        a2_attempts: defense_attempts[1],
        a2_rating: defense_speed[1],
        a2_assist: defense_assist[1],
        a2_stuck: defense_stuck[1],
        b1_success: defense_success[2],
        b1_attempts: defense_attempts[2],
        b1_rating: defense_speed[2],
        b1_assist: defense_assist[2],
        b1_stuck: defense_stuck[2],
        b2_success: defense_success[3],
        b2_attempts: defense_attempts[3],
        b2_rating: defense_speed[3],
        b2_assist: defense_assist[3],
        b2_stuck: defense_stuck[3],
        c1_success: defense_success[4],
        c1_attempts: defense_attempts[4],
        c1_rating: defense_speed[4],
        c1_assist: defense_assist[4],
        c1_stuck: defense_stuck[4],
        c2_success: defense_success[5],
        c2_attempts: defense_attempts[5],
        c2_rating: defense_speed[5],
        c2_assist: defense_assist[5],
        c2_stuck: defense_stuck[5],
        d1_success: defense_success[6],
        d1_attempts: defense_attempts[6],
        d1_rating: defense_speed[6],
        d1_assist: defense_assist[6],
        d1_stuck: defense_stuck[6],
        d2_success: defense_success[7],
        d2_attempts: defense_attempts[7],
        d2_rating: defense_speed[7],
        d2_assist: defense_assist[7],
        d2_stuck: defense_stuck[7],
        lb_success: defense_success[8],
        lb_attempts: defense_attempts[8],
        lb_rating: defense_speed[8],
        lb_assist: defense_assist[8],
        lb_stuck: defense_stuck[8],
        hang_success: tot_hang,
        hang_attempts: tot_hang_attempts,
        challenge_success: tot_challenge,
        challenge_attempts: tot_challenge_attempts,
        trend_data: trend_data,
        trend_labels: trend_labels,
        high_goal_trend: high_goal_trend
      });
    });
  });

  router.get("/matches/:team_number", function(req, res) {
    var team_number = req.params.team_number;
    var team_name = "";
    var matches = [];
    var auto_score = [];
    var contrib_score = [];
    var floor_intakes = [];
    var high_made = [];
    var high_attempts = [];
    var low_made = [];
    var low_attempts = [];
    var auto_high_made = [];
    var auto_high_attempts = [];
    var auto_low_made = [];
    var auto_low_attempts = [];
    var auto_reaches = [];
    var hang = [];
    var hang_attempts = [];
    var challenge = [];
    var challenge_attempts = [];
    var defense_success = [];
    var defense_attempts = [];
    var defense_stuck = [];
    var defense_assist = [];
    var defense_speed = [];
    var auto_defense_success = [];
    var auto_defense_attempts = [];
    var knockouts = [];
    var driver_rating = [];
    var bully_rating = [];
    var fouls = [];
    var deads = [];
    var no_autos = [];
    var matches_data = "";

    var team_name_sql = "SELECT * FROM teams WHERE team_number=" + team_number;
    connection.query(team_name_sql, function(err, rows, fields) {
      team_name = rows[0].team_name;
    });

    var matches_sql = "SELECT * FROM matches WHERE team_number=" + team_number;
    connection.query(matches_sql, function(err, rows, fields) {
      for(var x in rows) {
        matches[x] = rows[x].match_number;
        auto_score[x] = rows[x].auton_score;
        contrib_score[x] = rows[x].contributed_score;
        floor_intakes[x] = rows[x].tele_floor_intake;
        high_made[x] = rows[x].tele_high_made;
        high_attempts[x] = rows[x].tele_high_made + rows[x].tele_high_missed;
        low_made[x] = rows[x].tele_low_made;
        low_attempts[x] = rows[x].tele_low_made + rows[x].tele_low_missed;
        auto_high_made[x] = rows[x].auton_high;
        auto_high_attempts[x] = rows[x].auton_high + rows[x].auton_high_missed;
        auto_low_made[x] = rows[x].auton_low;
        auto_low_attempts[x] = rows[x].auton_low + rows[x].auton_low_missed;
        auto_reaches[x] = rows[x].auton_reach;
        hang[x] = rows[x].tele_hang;
        hang_attempts[x] = rows[x].tele_hang + rows[x].tele_hang_failed;
        challenge[x] = rows[x].tele_challenge;
        challenge_attempts[x] = rows[x].tele_challenge + rows[x].tele_challenge_failed;
        defense_success[x] = [];
        defense_attempts[x] = [];
        defense_stuck[x] = [];
        defense_assist[x] = [];
        defense_speed[x] = [];
        auto_defense_success[x] = [];
        auto_defense_attempts[x] = [];
        defense_success[x][0] = rows[x].a1_successful;
        defense_attempts[x][0] = rows[x].a1_attempts;
        defense_stuck[x][0] = rows[x].a1_stuck;
        defense_assist[x][0] = rows[x].a1_assists;
        defense_speed[x][0] = rows[x].a1_total;
        defense_success[x][1] = rows[x].a2_successful;
        defense_attempts[x][1] = rows[x].a2_attempts;
        defense_stuck[x][1] = rows[x].a2_stuck;
        defense_assist[x][1] = rows[x].a2_assists;
        defense_speed[x][1] = rows[x].a2_total;
        defense_success[x][2] = rows[x].b1_successful;
        defense_attempts[x][2] = rows[x].b1_attempts;
        defense_stuck[x][2] = rows[x].b1_stuck;
        defense_assist[x][2] = rows[x].b1_assists;
        defense_speed[x][2] = rows[x].b1_total;
        defense_success[x][3] = rows[x].b2_successful;
        defense_attempts[x][3] = rows[x].b2_attempts;
        defense_stuck[x][3] = rows[x].b2_stuck;
        defense_assist[x][3] = rows[x].b2_assists;
        defense_speed[x][3] = rows[x].b2_total;
        defense_success[x][4] = rows[x].c1_successful;
        defense_attempts[x][4] = rows[x].c1_attempts;
        defense_stuck[x][4] = rows[x].c1_stuck;
        defense_assist[x][4] = rows[x].c1_assists;
        defense_speed[x][4] = rows[x].c1_total;
        defense_success[x][5] = rows[x].c2_successful;
        defense_attempts[x][5] = rows[x].c2_attempts;
        defense_stuck[x][5] = rows[x].c2_stuck;
        defense_assist[x][5] = rows[x].c2_assists;
        defense_speed[x][5] = rows[x].c2_total;
        defense_success[x][6] = rows[x].d1_successful;
        defense_attempts[x][6] = rows[x].d1_attempts;
        defense_stuck[x][6] = rows[x].d1_stuck;
        defense_assist[x][6] = rows[x].d1_assists;
        defense_speed[x][6] = rows[x].d1_total;
        defense_success[x][7] = rows[x].d2_successful;
        defense_attempts[x][7] = rows[x].d2_attempts;
        defense_stuck[x][7] = rows[x].d2_stuck;
        defense_assist[x][7] = rows[x].d2_assists;
        defense_speed[x][7] = rows[x].d2_total;
        defense_success[x][8] = rows[x].lb_successful;
        defense_attempts[x][8] = rows[x].lb_attempts;
        defense_stuck[x][8] = rows[x].lb_stuck;
        defense_assist[x][8] = rows[x].lb_assists;
        defense_speed[x][8] = rows[x].lb_total;
        if(rows[0].auton_defense_crossed === "PC") {
          auto_defense_success[x][0] = 1;
          auto_defense_attempts[x][0] = 1;
          auto_defense_success[x][1] = 0;
          auto_defense_attempts[x][1] = 0;
          auto_defense_success[x][2] = 0;
          auto_defense_attempts[x][2] = 0;
          auto_defense_success[x][3] = 0;
          auto_defense_attempts[x][3] = 0;
          auto_defense_success[x][4] = 0;
          auto_defense_attempts[x][4] = 0;
          auto_defense_success[x][5] = 0;
          auto_defense_attempts[x][5] = 0;
          auto_defense_success[x][6] = 0;
          auto_defense_attempts[x][6] = 0;
          auto_defense_success[x][7] = 0;
          auto_defense_attempts[x][7] = 0;
          auto_defense_success[x][8] = 0;
          auto_defense_attempts[x][8] = 0;
        }
        else if(rows[x].auton_defense_crossed === "CF") {
          auto_defense_success[x][0] = 0;
          auto_defense_attempts[x][0] = 0;
          auto_defense_success[x][1] = 1;
          auto_defense_attempts[x][1] = 1;
          auto_defense_success[x][2] = 0;
          auto_defense_attempts[x][2] = 0;
          auto_defense_success[x][3] = 0;
          auto_defense_attempts[x][3] = 0;
          auto_defense_success[x][4] = 0;
          auto_defense_attempts[x][4] = 0;
          auto_defense_success[x][5] = 0;
          auto_defense_attempts[x][5] = 0;
          auto_defense_success[x][6] = 0;
          auto_defense_attempts[x][6] = 0;
          auto_defense_success[x][7] = 0;
          auto_defense_attempts[x][7] = 0;
          auto_defense_success[x][8] = 0;
          auto_defense_attempts[x][8] = 0;
        }
        else if(rows[x].auton_defense_crossed === "M") {
          auto_defense_success[x][0] = 0;
          auto_defense_attempts[x][0] = 0;
          auto_defense_success[x][1] = 0;
          auto_defense_attempts[x][1] = 0;
          auto_defense_success[x][2] = 1;
          auto_defense_attempts[x][2] = 1;
          auto_defense_success[x][3] = 0;
          auto_defense_attempts[x][3] = 0;
          auto_defense_success[x][4] = 0;
          auto_defense_attempts[x][4] = 0;
          auto_defense_success[x][5] = 0;
          auto_defense_attempts[x][5] = 0;
          auto_defense_success[x][6] = 0;
          auto_defense_attempts[x][6] = 0;
          auto_defense_success[x][7] = 0;
          auto_defense_attempts[x][7] = 0;
          auto_defense_success[x][8] = 0;
          auto_defense_attempts[x][8] = 0;
        }
        else if(rows[x].auton_defense_crossed === "RP") {
          auto_defense_success[x][0] = 0;
          auto_defense_attempts[x][0] = 0;
          auto_defense_success[x][1] = 0;
          auto_defense_attempts[x][1] = 0;
          auto_defense_success[x][2] = 0;
          auto_defense_attempts[x][2] = 0;
          auto_defense_success[x][3] = 1;
          auto_defense_attempts[x][3] = 1;
          auto_defense_success[x][4] = 0;
          auto_defense_attempts[x][4] = 0;
          auto_defense_success[x][5] = 0;
          auto_defense_attempts[x][5] = 0;
          auto_defense_success[x][6] = 0;
          auto_defense_attempts[x][6] = 0;
          auto_defense_success[x][7] = 0;
          auto_defense_attempts[x][7] = 0;
          auto_defense_success[x][8] = 0;
          auto_defense_attempts[x][8] = 0;
        }
        else if(rows[x].auton_defense_crossed === "DB") {
          auto_defense_success[x][0] = 0;
          auto_defense_attempts[x][0] = 0;
          auto_defense_success[x][1] = 0;
          auto_defense_attempts[x][1] = 0;
          auto_defense_success[x][2] = 0;
          auto_defense_attempts[x][2] = 0;
          auto_defense_success[x][3] = 0;
          auto_defense_attempts[x][3] = 0;
          auto_defense_success[x][4] = 1;
          auto_defense_attempts[x][4] = 1;
          auto_defense_success[x][5] = 0;
          auto_defense_attempts[x][5] = 0;
          auto_defense_success[x][6] = 0;
          auto_defense_attempts[x][6] = 0;
          auto_defense_success[x][7] = 0;
          auto_defense_attempts[x][7] = 0;
          auto_defense_success[x][8] = 0;
          auto_defense_attempts[x][8] = 0;
        }
        else if(rows[x].auton_defense_crossed === "SP") {
          auto_defense_success[x][0] = 0;
          auto_defense_attempts[x][0] = 0;
          auto_defense_success[x][1] = 0;
          auto_defense_attempts[x][1] = 0;
          auto_defense_success[x][2] = 0;
          auto_defense_attempts[x][2] = 0;
          auto_defense_success[x][3] = 0;
          auto_defense_attempts[x][3] = 0;
          auto_defense_success[x][4] = 0;
          auto_defense_attempts[x][4] = 0;
          auto_defense_success[x][5] = 1;
          auto_defense_attempts[x][5] = 1;
          auto_defense_success[x][6] = 0;
          auto_defense_attempts[x][6] = 0;
          auto_defense_success[x][7] = 0;
          auto_defense_attempts[x][7] = 0;
          auto_defense_success[x][8] = 0;
          auto_defense_attempts[x][8] = 0;
        }
        else if(rows[x].auton_defense_crossed === "RW") {
          auto_defense_success[x][0] = 0;
          auto_defense_attempts[x][0] = 0;
          auto_defense_success[x][1] = 0;
          auto_defense_attempts[x][1] = 0;
          auto_defense_success[x][2] = 0;
          auto_defense_attempts[x][2] = 0;
          auto_defense_success[x][3] = 0;
          auto_defense_attempts[x][3] = 0;
          auto_defense_success[x][4] = 0;
          auto_defense_attempts[x][4] = 0;
          auto_defense_success[x][5] = 0;
          auto_defense_attempts[x][5] = 0;
          auto_defense_success[x][6] = 1;
          auto_defense_attempts[x][6] = 1;
          auto_defense_success[x][7] = 0;
          auto_defense_attempts[x][7] = 0;
          auto_defense_success[x][8] = 0;
          auto_defense_attempts[x][8] = 0;
        }
        else if(rows[x].auton_defense_crossed === "RT") {
          auto_defense_success[x][0] = 0;
          auto_defense_attempts[x][0] = 0;
          auto_defense_success[x][1] = 0;
          auto_defense_attempts[x][1] = 0;
          auto_defense_success[x][2] = 0;
          auto_defense_attempts[x][2] = 0;
          auto_defense_success[x][3] = 0;
          auto_defense_attempts[x][3] = 0;
          auto_defense_success[x][4] = 0;
          auto_defense_attempts[x][4] = 0;
          auto_defense_success[x][5] = 0;
          auto_defense_attempts[x][5] = 0;
          auto_defense_success[x][6] = 0;
          auto_defense_attempts[x][6] = 0;
          auto_defense_success[x][7] = 1;
          auto_defense_attempts[x][7] = 1;
          auto_defense_success[x][8] = 0;
          auto_defense_attempts[x][8] = 0;
        }
        else if(rows[x].auton_defense_crossed === "LB") {
          auto_defense_success[x][0] = 0;
          auto_defense_attempts[x][0] = 0;
          auto_defense_success[x][1] = 0;
          auto_defense_attempts[x][1] = 0;
          auto_defense_success[x][2] = 0;
          auto_defense_attempts[x][2] = 0;
          auto_defense_success[x][3] = 0;
          auto_defense_attempts[x][3] = 0;
          auto_defense_success[x][4] = 0;
          auto_defense_attempts[x][4] = 0;
          auto_defense_success[x][5] = 0;
          auto_defense_attempts[x][5] = 0;
          auto_defense_success[x][6] = 0;
          auto_defense_attempts[x][6] = 0;
          auto_defense_success[x][7] = 0;
          auto_defense_attempts[x][7] = 0;
          auto_defense_success[x][8] = 1;
          auto_defense_attempts[x][8] = 1;
        }
        else {
          auto_defense_success[x][0] = 0;
          auto_defense_attempts[x][0] = 0;
          auto_defense_success[x][1] = 0;
          auto_defense_attempts[x][1] = 0;
          auto_defense_success[x][2] = 0;
          auto_defense_attempts[x][2] = 0;
          auto_defense_success[x][3] = 0;
          auto_defense_attempts[x][3] = 0;
          auto_defense_success[x][4] = 0;
          auto_defense_attempts[x][4] = 0;
          auto_defense_success[x][5] = 0;
          auto_defense_attempts[x][5] = 0;
          auto_defense_success[x][6] = 0;
          auto_defense_attempts[x][6] = 0;
          auto_defense_success[x][7] = 0;
          auto_defense_attempts[x][7] = 0;
          auto_defense_success[x][8] = 0;
          auto_defense_attempts[x][8] = 0;
        }
        knockouts[x] = rows[x].tele_knock_out;
        driver_rating[x] = rows[x].driver_rating;
        bully_rating[x] = rows[x].bully_rating;
        fouls[x] = rows[x].fouls_noticed;
        deads[x] = rows[x].dead;
        if(rows[x].auton_score === 0)
          no_autos[x] = 1;
        else
          no_autos[x] = 0;

        if(matches.length % 2 === 1) {
          matches_data += "<tr>";
        }
        matches_data += "<td style=\"padding-left:30px;\">" +
        "<div class=\"row\">" +
          "<div class=\"col-lg-12\">" +
            "<h2>" +
              "<a style=\"color: black;\" href=\"/match/" + team_number + "," + matches[x] + "\">Match #" + matches[x] + "</a>" +
            "</h2>" +
          "</div>" +
        "</div>" +
        "<div class=\"row\">" +
          "<div class=\"col-lg-10\">" +
            "<h3 style=\"margin-top:0;\">Contributed Score: " + auto_score[x] + " / " + contrib_score[x] + "</h3>" +
            "<h3><u>Autonomous Data</u></h3>" +
            "<table class=\"table\">" +
              "<tr>" +
                "<td><h4 style=\"margin-top:0;\">No Auto: " + no_autos[x] + "</h4></td>" +
                "<td style=\"text-align:right; padding-right:50px;\"><h4 style=\"margin-top:0;\">Reaches: " + auto_reaches[x] + "</h4></td>" +
              "</tr>" +
              "<tr>" +
                "<td><h4 style=\"margin-top:0;\">High Goals: " + auto_high_made[x] + " / " + auto_high_attempts[x] + "</h4></td>" +
                "<td style=\"text-align:right; padding-right:50px;\"><h4 style=\"margin-top:0;\">Low Goals: " + auto_low_made[x] + " / " + auto_low_attempts[x] + "</h4></td>" +
              "</tr>" +
            "</table>" +
            "<table class=\"table\">" +
              "<tr>" +
                "<th>PC</th>" +
                "<th>CF</th>" +
                "<th>M</th>" +
                "<th>RP</th>" +
                "<th>DB</th>" +
                "<th>SP</th>" +
                "<th>RW</th>" +
                "<th>LB</th>" +
                "<th>RT</th>" +
              "</tr>" +
              "<tr>" +
                "<td>" + auto_defense_success[x][0] + " / " + auto_defense_attempts[x][0] + "</td>" +
                "<td>" + auto_defense_success[x][1] + " / " + auto_defense_attempts[x][1] + "</td>" +
                "<td>" + auto_defense_success[x][2] + " / " + auto_defense_attempts[x][2] + "</td>" +
                "<td>" + auto_defense_success[x][3] + " / " + auto_defense_attempts[x][3] + "</td>" +
                "<td>" + auto_defense_success[x][4] + " / " + auto_defense_attempts[x][4] + "</td>" +
                "<td>" + auto_defense_success[x][5] + " / " + auto_defense_attempts[x][5] + "</td>" +
                "<td>" + auto_defense_success[x][6] + " / " + auto_defense_attempts[x][6] + "</td>" +
                "<td>" + auto_defense_success[x][7] + " / " + auto_defense_attempts[x][7] + "</td>" +
                "<td>" + auto_defense_success[x][8] + " / " + auto_defense_attempts[x][8] + "</td>" +
              "</tr>" +
            "</table>" +
            "<h3><u>Teleop Data</u></h3>" +
            "<table class=\"table\">" +
              "<tr>" +
                "<td><h4 style=\"margin-top:0;\">High Goals: " + high_made[x] + " / " + high_attempts[x] + "</h4></td>" +
                "<td style=\"text-align:right; padding-right:50px;\"><h4 style=\"margin-top:0;\">Low Goals: " + low_made[x] + " / " + low_attempts[x] + "</h4></td>" +
              "</tr>" +
              "<tr>" +
                "<td><h4 style=\"margin-top:0;\">Driver Rating: " + driver_rating[x] + "</h4></td>" +
                "<td style=\"text-align:right; padding-right:50px;\"><h4 style=\"margin-top:0;\">Bully Rating: " + bully_rating[x] + "</h4></td>" +
              "</tr>" +
              "<tr>" +
                "<td><h4 style=\"margin-top:0;\">Knockouts: " + knockouts[x] + "</h4></td>" +
                "<td style=\"text-align:right; padding-right:50px;\"><h4 style=\"margin-top:0;\">Floor Intakes: " + floor_intakes[x] + "</h4></td>" +
              "</tr>" +
              "<tr>" +
                "<td><h4 style=\"margin-top:0;\">Deads: " + deads[x] + "</h4></td>" +
                "<td style=\"text-align:right; padding-right:50px;\"><h4 style=\"margin-top:0;\">Fouls: " + fouls[x] + "</h4></td>" +
              "</tr>" +
            "</table>" +
            "<table class=\"table\">" +
              "<tr>" +
                "<th />" +
                "<th>Results</th>" +
                "<th>Rating</th>" +
                "<th>Assist</th>" +
                "<th>Stuck</th>" +
              "</tr>" +
              "<tr>" +
                "<th>PC</th>" +
                "<td>" + defense_success[x][0] + " / " + defense_attempts[x][0] + "</td>" +
                "<td>" + defense_speed[x][0] + "</td>" +
                "<td>" + defense_assist[x][0] + "</td>" +
                "<td>" + defense_stuck[x][0] + "</td>" +
              "</tr>" +
              "<tr>" +
                "<th>CF</th>" +
                "<td>" + defense_success[x][1] + " / " + defense_attempts[x][1] + "</td>" +
                "<td>" + defense_speed[x][1] + "</td>" +
                "<td>" + defense_assist[x][1] + "</td>" +
                "<td>" + defense_stuck[x][1] + "</td>" +
              "</tr>" +
              "<tr>" +
                "<th>M</th>" +
                "<td>" + defense_success[x][2] + " / " + defense_attempts[x][2] + "</td>" +
                "<td>" + defense_speed[x][2] + "</td>" +
                "<td>" + defense_assist[x][2] + "</td>" +
                "<td>" + defense_stuck[x][2] + "</td>" +
              "</tr>" +
              "<tr>" +
                "<th>RP</th>" +
                "<td>" + defense_success[x][3] + " / " + defense_attempts[x][3] + "</td>" +
                "<td>" + defense_speed[x][3] + "</td>" +
                "<td>" + defense_assist[x][3] + "</td>" +
                "<td>" + defense_stuck[x][3] + "</td>" +
              "</tr>" +
              "<tr>" +
                "<th>DB</th>" +
                "<td>" + defense_success[x][4] + " / " + defense_attempts[x][4] + "</td>" +
                "<td>" + defense_speed[x][4] + "</td>" +
                "<td>" + defense_assist[x][4] + "</td>" +
                "<td>" + defense_stuck[x][4] + "</td>" +
              "</tr>" +
              "<tr>" +
                "<th>SP</th>" +
                "<td>" + defense_success[x][5] + " / " + defense_attempts[x][5] + "</td>" +
                "<td>" + defense_speed[x][5] + "</td>" +
                "<td>" + defense_assist[x][5] + "</td>" +
                "<td>" + defense_stuck[x][5] + "</td>" +
              "</tr>" +
              "<tr>" +
                "<th>RW</th>" +
                "<td>" + defense_success[x][6] + " / " + defense_attempts[x][6] + "</td>" +
                "<td>" + defense_speed[x][6] + "</td>" +
                "<td>" + defense_assist[x][6] + "</td>" +
                "<td>" + defense_stuck[x][6] + "</td>" +
              "</tr>" +
              "<tr>" +
                "<th>RT</th>" +
                "<td>" + defense_success[x][7] + " / " + defense_attempts[x][7] + "</td>" +
                "<td>" + defense_speed[x][7] + "</td>" +
                "<td>" + defense_assist[x][7] + "</td>" +
                "<td>" + defense_stuck[x][7] + "</td>" +
              "</tr>" +
              "<tr>" +
                "<th>LB</th>" +
                "<td>" + defense_success[x][8] + " / " + defense_attempts[x][8] + "</td>" +
                "<td>" + defense_speed[x][8] + "</td>" +
                "<td>" + defense_assist[x][8] + "</td>" +
                "<td>" + defense_stuck[x][8] + "</td>" +
              "</tr>" +
            "</table>" +
            "<h3><u>End Game</u></h3>" +
            "<table class=\"table\">" +
              "<tr>" +
                "<td><h4 style=\"margin-top:0;\">Hang: " + hang[x] + " / " + hang_attempts[x] + "</h4></td>" +
                "<td style=\"text-align:right; padding-right:50px;\"><h4 style=\"margin-top:0;\">Challenge: " + challenge[x] + " / " + challenge_attempts[x] + "</h4></td>" +
              "</tr>" +
            "</table>" +
          "</div>" +
        "</div>" +
        "</td>";
        if(matches.length % 2 === 0) {
          matches_data += "</tr>";
        }
      }

      res.render("pages/team_match", {
        team_number: team_number,
        team_name: team_name,
        matches: matches_data
      });
    });
  });

  router.get("/match/:team_number,:match_number", function(req, res) {
    var team_number = req.params.team_number;
    var match_number = req.params.match_number;
    var team_name = "";
    var num_matches = 0;
    var auto_score = 0;
    var contrib_score = 0;
    var floor_intakes = 0;
    var high_made = 0;
    var high_attempts = 0;
    var low_made = 0;
    var low_attempts = 0;
    var auto_high_made = 0;
    var auto_high_attempts = 0;
    var auto_low_made = 0;
    var auto_low_attempts = 0;
    var auto_reaches = 0;
    var hang = 0;
    var hang_attempts = 0;
    var challenge = 0;
    var challenge_attempts = 0;
    var defense_success = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var defense_attempts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var defense_stuck = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var defense_assist = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var defense_speed = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var auto_defense_success = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var auto_defense_attempts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var knockouts = 0;
    var driver_rating = 0;
    var bully_rating = 0;
    var fouls = 0;
    var deads = 0;
    var team_sql = "SELECT * FROM matches WHERE team_number=" + team_number + " AND match_number=" + match_number;
    connection.query(team_sql, function(err, rows, fields) {
      auto_score = rows[0].auton_score;
      contrib_score = rows[0].contributed_score;
      floor_intakes = rows[0].tele_floor_intake;
      high_made = rows[0].tele_high_made;
      high_attempts = rows[0].tele_high_made + rows[0].tele_high_missed;
      low_made = rows[0].tele_low_made;
      low_attempts = rows[0].tele_low_made + rows[0].tele_low_missed;
      auto_high_made = rows[0].auton_high;
      auto_high_attempts = rows[0].auton_high + rows[0].auton_high_missed;
      auto_low_made = rows[0].auton_low;
      auto_low_attempts = rows[0].auton_low + rows[0].auton_low_missed;
      auto_reaches = rows[0].auton_reach;
      hang = rows[0].tele_hang;
      hang_attempts = rows[0].tele_hang + rows[0].tele_hang_failed;
      challenge = rows[0].tele_challenge;
      challenge_attempts = rows[0].tele_challenge + rows[0].tele_challenge_failed;
      defense_success[0] = rows[0].a1_successful;
      defense_attempts[0] = rows[0].a1_attempts;
      defense_stuck[0] = rows[0].a1_stuck;
      defense_assist[0] = rows[0].a1_assisted;
      defense_speed[0] = rows[0].a1_total;
      defense_success[1] = rows[0].a2_successful;
      defense_attempts[1] = rows[0].a2_attempts;
      defense_stuck[1] = rows[0].a2_stuck;
      defense_assist[1] = rows[0].a2_assisted;
      defense_speed[1] = rows[0].a2_total;
      defense_success[2] = rows[0].b1_successful;
      defense_attempts[2] = rows[0].b1_attempts;
      defense_stuck[2] = rows[0].b1_stuck;
      defense_assist[2] = rows[0].b1_assisted;
      defense_speed[2] = rows[0].b1_total;
      defense_success[3] = rows[0].b2_successful;
      defense_attempts[3] = rows[0].b2_attempts;
      defense_stuck[3] = rows[0].b2_stuck;
      defense_assist[3] = rows[0].b2_assisted;
      defense_speed[3] = rows[0].b2_total;
      defense_success[4] = rows[0].c1_successful;
      defense_attempts[4] = rows[0].c1_attempts;
      defense_stuck[4] = rows[0].c1_stuck;
      defense_assist[4] = rows[0].c1_assisted;
      defense_speed[4] = rows[0].c1_total;
      defense_success[5] = rows[0].c2_successful;
      defense_attempts[5] = rows[0].c2_attempts;
      defense_stuck[5] = rows[0].c2_stuck;
      defense_assist[5] = rows[0].c2_assisted;
      defense_speed[5] = rows[0].c2_total;
      defense_success[6] = rows[0].d1_successful;
      defense_attempts[6] = rows[0].d1_attempts;
      defense_stuck[6] = rows[0].d1_stuck;
      defense_assist[6] = rows[0].d1_assisted;
      defense_speed[6] = rows[0].d1_total;
      defense_success[7] = rows[0].d2_successful;
      defense_attempts[7] = rows[0].d2_attempts;
      defense_stuck[7] = rows[0].d2_stuck;
      defense_assist[7] = rows[0].d2_assisted;
      defense_speed[7] = rows[0].d2_total;
      defense_success[8] = rows[0].lb_successful;
      defense_attempts[8] = rows[0].lb_attempts;
      defense_stuck[8] = rows[0].lb_stuck;
      defense_assist[8] = rows[0].lb_assisted;
      defense_speed[8] = rows[0].lb_total;
      if(rows[0].auton_defense_crossed === "PC") {
        auto_defense_success[0] = 1;
        auto_defense_attempts[0] = 1;
      }
      else if(rows[0].auton_defense_crossed === "CF") {
        auto_defense_success[1] = 1;
        auto_defense_attempts[1] = 1;
      }
      else if(rows[0].auton_defense_crossed === "M") {
        auto_defense_success[2] = 1;
        auto_defense_attempts[2] = 1;
      }
      else if(rows[0].auton_defense_crossed === "RP") {
        auto_defense_success[3] = 1;
        auto_defense_attempts[3] = 1;
      }
      else if(rows[0].auton_defense_crossed === "DB") {
        auto_defense_success[4] = 1;
        auto_defense_attempts[4] = 1;
      }
      else if(rows[0].auton_defense_crossed === "SP") {
        auto_defense_success[5] = 1;
        auto_defense_attempts[5] = 1;
      }
      else if(rows[0].auton_defense_crossed === "RW") {
        auto_defense_success[6] = 1;
        auto_defense_attempts[6] = 1;
      }
      else if(rows[0].auton_defense_crossed === "RT") {
        auto_defense_success[7] = 1;
        auto_defense_attempts[7] = 1;
      }
      else if(rows[0].auton_defense_crossed === "LB") {
        auto_defense_success[8] = 1;
        auto_defense_attempts[8] = 1;
      }
      knockouts = rows[0].tele_knock_out;
      driver_rating = rows[0].driver_rating;
      bully_rating = rows[0].bully_rating;
      fouls = rows[0].fouls_noticed;
      deads = rows[0].dead;
    });
    var team_name_sql = "SELECT * FROM teams WHERE team_number=" + team_number;
    connection.query(team_name_sql, function(err, rows, fields) {
      team_name = rows[0].team_name;
    });

    var no_auto_sql = "SELECT * FROM matches WHERE team_number = " + team_number + " AND match_number=" + match_number + " AND auton_score = 0";
    var no_autos = 0;
    connection.query(no_auto_sql, function(err, rows, fields) {
      for(var x in rows) {
        no_autos++;
      }

      res.render("pages/match", {
        team_number: team_number,
        team_name: team_name,
        match_number: match_number,
        avg_auto_score: auto_score,
        avg_contrib_score: contrib_score,
        no_autos: no_autos,
        auto_reaches: auto_reaches,
        auto_high_made: auto_high_made,
        auto_high_attempts: auto_high_attempts,
        auto_low_made: auto_low_made,
        auto_low_attempts: auto_low_attempts,
        auto_a1_success: auto_defense_success[0],
        auto_a1_attempts: auto_defense_attempts[0],
        auto_a2_success: auto_defense_success[1],
        auto_a2_attempts: auto_defense_attempts[1],
        auto_b1_success: auto_defense_success[2],
        auto_b1_attempts: auto_defense_attempts[2],
        auto_b2_success: auto_defense_success[3],
        auto_b2_attempts: auto_defense_attempts[3],
        auto_c1_success: auto_defense_success[4],
        auto_c1_attempts: auto_defense_attempts[4],
        auto_c2_success: auto_defense_success[5],
        auto_c2_attempts: auto_defense_attempts[5],
        auto_d1_success: auto_defense_success[6],
        auto_d1_attempts: auto_defense_attempts[6],
        auto_d2_success: auto_defense_success[7],
        auto_d2_attempts: auto_defense_attempts[7],
        auto_lb_success: auto_defense_success[8],
        auto_lb_attempts: auto_defense_attempts[8],
        tele_high_made: high_made,
        tele_high_attempts: high_attempts,
        tele_low_made: low_made,
        tele_low_attempts: low_attempts,
        avg_driver_rating: driver_rating,
        avg_bully_rating: bully_rating,
        knockouts: knockouts,
        floor_intakes: floor_intakes,
        deads: deads,
        fouls: fouls,
        a1_success: defense_success[0],
        a1_attempts: defense_attempts[0],
        a1_rating: defense_speed[0],
        a1_assist: defense_assist[0],
        a1_stuck: defense_stuck[0],
        a2_success: defense_success[1],
        a2_attempts: defense_attempts[1],
        a2_rating: defense_speed[1],
        a2_assist: defense_assist[1],
        a2_stuck: defense_stuck[1],
        b1_success: defense_success[2],
        b1_attempts: defense_attempts[2],
        b1_rating: defense_speed[2],
        b1_assist: defense_assist[2],
        b1_stuck: defense_stuck[2],
        b2_success: defense_success[3],
        b2_attempts: defense_attempts[3],
        b2_rating: defense_speed[3],
        b2_assist: defense_assist[3],
        b2_stuck: defense_stuck[3],
        c1_success: defense_success[4],
        c1_attempts: defense_attempts[4],
        c1_rating: defense_speed[4],
        c1_assist: defense_assist[4],
        c1_stuck: defense_stuck[4],
        c2_success: defense_success[5],
        c2_attempts: defense_attempts[5],
        c2_rating: defense_speed[5],
        c2_assist: defense_assist[5],
        c2_stuck: defense_stuck[5],
        d1_success: defense_success[6],
        d1_attempts: defense_attempts[6],
        d1_rating: defense_speed[6],
        d1_assist: defense_assist[6],
        d1_stuck: defense_stuck[6],
        d2_success: defense_success[7],
        d2_attempts: defense_attempts[7],
        d2_rating: defense_speed[7],
        d2_assist: defense_assist[7],
        d2_stuck: defense_stuck[7],
        lb_success: defense_success[8],
        lb_attempts: defense_attempts[8],
        lb_rating: defense_speed[8],
        lb_assist: defense_assist[8],
        lb_stuck: defense_stuck[8],
        hang_success: hang,
        hang_attempts: hang_attempts,
        challenge_success: challenge,
        challenge_attempts: challenge_attempts
      });
    });
  });

  router.get("/alliance", function(req, res) {
    res.render("pages/alliance_gen");
  });

  router.post("/alliance-gen", function(req, res) {
    var team_1 = req.body.team_1;
    var team_2 = req.body.team_2;
    var team_3 = req.body.team_3;
    res.redirect("/alliance/" + team_1 + "," + team_2 + "," + team_3);
  });

  router.get("/alliance/:team_1,:team_2,:team_3", function(req, res) {
    console.log(req.params.team_1 + ", " + req.params.team_2 + ", " + req.params.team_3);
    var team_number_1 = req.params.team_1;
    var team_name_1 = "";
    var avg_auto_score_1 = 0;
    var avg_contrib_score_1 = 0;
    var floor_intakes_1 = 0;
    var high_made_1 = 0;
    var high_attempts_1 = 0;
    var low_made_1 = 0;
    var low_attempts_1 = 0;
    var auto_high_made_1 = 0;
    var auto_high_attempts_1 = 0;
    var auto_low_made_1 = 0;
    var auto_low_attempts_1 = 0;
    var auto_reaches_1 = 0;
    var tot_hang_1 = 0;
    var tot_hang_attempts_1 = 0;
    var tot_challenge_1 = 0;
    var tot_challenge_attempts_1 = 0;
    var defense_success_1 = [];
    var defense_attempts_1 = [];
    var defense_stuck_1 = [];
    var defense_assist_1 = [];
    var defense_speed_1 = [];
    var auto_defense_success_1 = [];
    var auto_defense_attempts_1 = [];
    var knockouts_1 = 0;
    var avg_driver_rating_1 = 0;
    var avg_bully_rating_1 = 0;
    var fouls_1 = 0;
    var deads_1 = 0;
    var team_sql_1 = "SELECT * FROM teams WHERE team_number=" + team_number_1;
    connection.query(team_sql_1, function(err, rows, fields) {
      team_name_1 = rows[0].team_name;
      avg_auto_score_1 = rows[0].avg_auton_score;
      avg_contrib_score_1 = rows[0].avg_contrib_score;
      floor_intakes_1 = rows[0].avg_floor_intakes;
      high_made_1 = rows[0].avg_high_made;
      high_attempts_1 = rows[0].avg_high_attempts;
      low_made_1 = rows[0].avg_low_made;
      low_attempts_1 = rows[0].avg_low_attempts;
      auto_high_made_1 = rows[0].auton_high_made;
      auto_high_attempts_1 = rows[0].auton_high_attempts;
      auto_low_made_1 = rows[0].auton_low_made;
      auto_low_attempts_1 = rows[0].auton_low_attempts;
      auto_reaches_1 = rows[0].auton_reaches_total;
      tot_hang_1 = rows[0].total_hangs;
      tot_hang_attempts_1 = rows[0].total_hang_attempts;
      tot_challenge_1 = rows[0].total_challenges;
      tot_challenge_attempts_1 = rows[0].total_challenge_attempts;
      defense_success_1[0] = rows[0].tot_a1_successful;
      defense_attempts_1[0] = rows[0].tot_a1_attempts;
      defense_stuck_1[0] = rows[0].tot_a1_stuck;
      defense_assist_1[0] = rows[0].tot_a1_assisted;
      defense_speed_1[0] = rows[0].avg_a1_speed;
      defense_success_1[1] = rows[0].tot_a2_successful;
      defense_attempts_1[1] = rows[0].tot_a2_attempts;
      defense_stuck_1[1] = rows[0].tot_a2_stuck;
      defense_assist_1[1] = rows[0].tot_a2_assisted;
      defense_speed_1[1] = rows[0].avg_a2_speed;
      defense_success_1[2] = rows[0].tot_b1_successful;
      defense_attempts_1[2] = rows[0].tot_b1_attempts;
      defense_stuck_1[2] = rows[0].tot_b1_stuck;
      defense_assist_1[2] = rows[0].tot_b1_assisted;
      defense_speed_1[2] = rows[0].avg_b1_speed;
      defense_success_1[3] = rows[0].tot_b2_successful;
      defense_attempts_1[3] = rows[0].tot_b2_attempts;
      defense_stuck_1[3] = rows[0].tot_b2_stuck;
      defense_assist_1[3] = rows[0].tot_b2_assisted;
      defense_speed_1[3] = rows[0].avg_b2_speed;
      defense_success_1[4] = rows[0].tot_c1_successful;
      defense_attempts_1[4] = rows[0].tot_c1_attempts;
      defense_stuck_1[4] = rows[0].tot_c1_stuck;
      defense_assist_1[4] = rows[0].tot_c1_assisted;
      defense_speed_1[4] = rows[0].avg_c1_speed;
      defense_success_1[5] = rows[0].tot_c2_successful;
      defense_attempts_1[5] = rows[0].tot_c2_attempts;
      defense_stuck_1[5] = rows[0].tot_c2_stuck;
      defense_assist_1[5] = rows[0].tot_c2_assisted;
      defense_speed_1[5] = rows[0].avg_c2_speed;
      defense_success_1[6] = rows[0].tot_d1_successful;
      defense_attempts_1[6] = rows[0].tot_d1_attempts;
      defense_stuck_1[6] = rows[0].tot_d1_stuck;
      defense_assist_1[6] = rows[0].tot_d1_assisted;
      defense_speed_1[6] = rows[0].avg_d1_speed;
      defense_success_1[7] = rows[0].tot_d2_successful;
      defense_attempts_1[7] = rows[0].tot_d2_attempts;
      defense_stuck_1[7] = rows[0].tot_d2_stuck;
      defense_assist_1[7] = rows[0].tot_d2_assisted;
      defense_speed_1[7] = rows[0].avg_d2_speed;
      defense_success_1[8] = rows[0].tot_lb_successful;
      defense_attempts_1[8] = rows[0].tot_lb_attempts;
      defense_stuck_1[8] = rows[0].tot_lb_stuck;
      defense_assist_1[8] = rows[0].tot_lb_assisted;
      defense_speed_1[8] = rows[0].avg_lb_speed;
      auto_defense_success_1[0] = rows[0].auton_a1;
      auto_defense_attempts_1[0] = rows[0].auton_a1_attempts;
      auto_defense_success_1[1] = rows[0].auton_a2;
      auto_defense_attempts_1[1] = rows[0].auton_a2_attempts;
      auto_defense_success_1[2] = rows[0].auton_b1;
      auto_defense_attempts_1[2] = rows[0].auton_b1_attempts;
      auto_defense_success_1[3] = rows[0].auton_b2;
      auto_defense_attempts_1[3] = rows[0].auton_b2_attempts;
      auto_defense_success_1[4] = rows[0].auton_c1;
      auto_defense_attempts_1[4] = rows[0].auton_c1_attempts;
      auto_defense_success_1[5] = rows[0].auton_c2;
      auto_defense_attempts_1[5] = rows[0].auton_c2_attempts;
      auto_defense_success_1[6] = rows[0].auton_d1;
      auto_defense_attempts_1[6] = rows[0].auton_d1_attempts;
      auto_defense_success_1[7] = rows[0].auton_d2;
      auto_defense_attempts_1[7] = rows[0].auton_d2_attempts;
      auto_defense_success_1[8] = rows[0].auton_lb;
      auto_defense_attempts_1[8] = rows[0].auton_lb_attempts;
      knockouts_1 = rows[0].total_knockouts;
      avg_driver_rating_1 = rows[0].avg_driver_rating;
      avg_bully_rating_1 = rows[0].avg_bully_rating;
      fouls_1 = rows[0].total_fouls;
      deads_1 = rows[0].tot_dead;
    });
    var no_auto_sql_1 = "SELECT * FROM matches WHERE team_number = " + team_number_1 + " AND auton_score = 0"
    var no_autos_1 = 0;
    connection.query(no_auto_sql_1, function(err, rows, fields) {
      for(var x in rows)
      {
        no_autos_1++;
      }
    });

    var team_number_2 = req.params.team_2;
    var team_name_2 = "";
    var avg_auto_score_2 = 0;
    var avg_contrib_score_2 = 0;
    var floor_intakes_2 = 0;
    var high_made_2 = 0;
    var high_attempts_2 = 0;
    var low_made_2 = 0;
    var low_attempts_2 = 0;
    var auto_high_made_2 = 0;
    var auto_high_attempts_2 = 0;
    var auto_low_made_2 = 0;
    var auto_low_attempts_2 = 0;
    var auto_reaches_2 = 0;
    var tot_hang_2 = 0;
    var tot_hang_attempts_2 = 0;
    var tot_challenge_2 = 0;
    var tot_challenge_attempts_2 = 0;
    var defense_success_2 = [];
    var defense_attempts_2 = [];
    var defense_stuck_2 = [];
    var defense_assist_2 = [];
    var defense_speed_2 = [];
    var auto_defense_success_2 = [];
    var auto_defense_attempts_2 = [];
    var knockouts_2 = 0;
    var avg_driver_rating_2 = 0;
    var avg_bully_rating_2 = 0;
    var fouls_2 = 0;
    var deads_2 = 0;
    var team_sql_2 = "SELECT * FROM teams WHERE team_number=" + team_number_2;
    connection.query(team_sql_2, function(err, rows, fields) {
      team_name_2 = rows[0].team_name;
      avg_auto_score_2 = rows[0].avg_auton_score;
      avg_contrib_score_2 = rows[0].avg_contrib_score;
      floor_intakes_2 = rows[0].avg_floor_intakes;
      high_made_2 = rows[0].avg_high_made;
      high_attempts_2 = rows[0].avg_high_attempts;
      low_made_2 = rows[0].avg_low_made;
      low_attempts_2 = rows[0].avg_low_attempts;
      auto_high_made_2 = rows[0].auton_high_made;
      auto_high_attempts_2 = rows[0].auton_high_attempts;
      auto_low_made_2 = rows[0].auton_low_made;
      auto_low_attempts_2 = rows[0].auton_low_attempts;
      auto_reaches_2 = rows[0].auton_reaches_total;
      tot_hang_2 = rows[0].total_hangs;
      tot_hang_attempts_2 = rows[0].total_hang_attempts;
      tot_challenge_2 = rows[0].total_challenges;
      tot_challenge_attempts_2 = rows[0].total_challenge_attempts;
      defense_success_2[0] = rows[0].tot_a1_successful;
      defense_attempts_2[0] = rows[0].tot_a1_attempts;
      defense_stuck_2[0] = rows[0].tot_a1_stuck;
      defense_assist_2[0] = rows[0].tot_a1_assisted;
      defense_speed_2[0] = rows[0].avg_a1_speed;
      defense_success_2[1] = rows[0].tot_a2_successful;
      defense_attempts_2[1] = rows[0].tot_a2_attempts;
      defense_stuck_2[1] = rows[0].tot_a2_stuck;
      defense_assist_2[1] = rows[0].tot_a2_assisted;
      defense_speed_2[1] = rows[0].avg_a2_speed;
      defense_success_2[2] = rows[0].tot_b1_successful;
      defense_attempts_2[2] = rows[0].tot_b1_attempts;
      defense_stuck_2[2] = rows[0].tot_b1_stuck;
      defense_assist_2[2] = rows[0].tot_b1_assisted;
      defense_speed_2[2] = rows[0].avg_b1_speed;
      defense_success_2[3] = rows[0].tot_b2_successful;
      defense_attempts_2[3] = rows[0].tot_b2_attempts;
      defense_stuck_2[3] = rows[0].tot_b2_stuck;
      defense_assist_2[3] = rows[0].tot_b2_assisted;
      defense_speed_2[3] = rows[0].avg_b2_speed;
      defense_success_2[4] = rows[0].tot_c1_successful;
      defense_attempts_2[4] = rows[0].tot_c1_attempts;
      defense_stuck_2[4] = rows[0].tot_c1_stuck;
      defense_assist_2[4] = rows[0].tot_c1_assisted;
      defense_speed_2[4] = rows[0].avg_c1_speed;
      defense_success_2[5] = rows[0].tot_c2_successful;
      defense_attempts_2[5] = rows[0].tot_c2_attempts;
      defense_stuck_2[5] = rows[0].tot_c2_stuck;
      defense_assist_2[5] = rows[0].tot_c2_assisted;
      defense_speed_2[5] = rows[0].avg_c2_speed;
      defense_success_2[6] = rows[0].tot_d1_successful;
      defense_attempts_2[6] = rows[0].tot_d1_attempts;
      defense_stuck_2[6] = rows[0].tot_d1_stuck;
      defense_assist_2[6] = rows[0].tot_d1_assisted;
      defense_speed_2[6] = rows[0].avg_d1_speed;
      defense_success_2[7] = rows[0].tot_d2_successful;
      defense_attempts_2[7] = rows[0].tot_d2_attempts;
      defense_stuck_2[7] = rows[0].tot_d2_stuck;
      defense_assist_2[7] = rows[0].tot_d2_assisted;
      defense_speed_2[7] = rows[0].avg_d2_speed;
      defense_success_2[8] = rows[0].tot_lb_successful;
      defense_attempts_2[8] = rows[0].tot_lb_attempts;
      defense_stuck_2[8] = rows[0].tot_lb_stuck;
      defense_assist_2[8] = rows[0].tot_lb_assisted;
      defense_speed_2[8] = rows[0].avg_lb_speed;
      auto_defense_success_2[0] = rows[0].auton_a1;
      auto_defense_attempts_2[0] = rows[0].auton_a1_attempts;
      auto_defense_success_2[1] = rows[0].auton_a2;
      auto_defense_attempts_2[1] = rows[0].auton_a2_attempts;
      auto_defense_success_2[2] = rows[0].auton_b1;
      auto_defense_attempts_2[2] = rows[0].auton_b1_attempts;
      auto_defense_success_2[3] = rows[0].auton_b2;
      auto_defense_attempts_2[3] = rows[0].auton_b2_attempts;
      auto_defense_success_2[4] = rows[0].auton_c1;
      auto_defense_attempts_2[4] = rows[0].auton_c1_attempts;
      auto_defense_success_2[5] = rows[0].auton_c2;
      auto_defense_attempts_2[5] = rows[0].auton_c2_attempts;
      auto_defense_success_2[6] = rows[0].auton_d1;
      auto_defense_attempts_2[6] = rows[0].auton_d1_attempts;
      auto_defense_success_2[7] = rows[0].auton_d2;
      auto_defense_attempts_2[7] = rows[0].auton_d2_attempts;
      auto_defense_success_2[8] = rows[0].auton_lb;
      auto_defense_attempts_2[8] = rows[0].auton_lb_attempts;
      knockouts_2 = rows[0].total_knockouts;
      avg_driver_rating_2 = rows[0].avg_driver_rating;
      avg_bully_rating_2 = rows[0].avg_bully_rating;
      fouls_2 = rows[0].total_fouls;
      deads_2 = rows[0].tot_dead;
    });
    var no_auto_sql_2 = "SELECT * FROM matches WHERE team_number = " + team_number_2 + " AND auton_score = 0"
    var no_autos_2 = 0;
    connection.query(no_auto_sql_2, function(err, rows, fields) {
      for(var x in rows)
      {
        no_autos_2++;
      }
    });

    var team_number_3 = req.params.team_3;
    var team_name_3 = "";
    var avg_auto_score_3 = 0;
    var avg_contrib_score_3 = 0;
    var floor_intakes_3 = 0;
    var high_made_3 = 0;
    var high_attempts_3 = 0;
    var low_made_3 = 0;
    var low_attempts_3 = 0;
    var auto_high_made_3 = 0;
    var auto_high_attempts_3 = 0;
    var auto_low_made_3 = 0;
    var auto_low_attempts_3 = 0;
    var auto_reaches_3 = 0;
    var tot_hang_3 = 0;
    var tot_hang_attempts_3 = 0;
    var tot_challenge_3 = 0;
    var tot_challenge_attempts_3 = 0;
    var defense_success_3 = [];
    var defense_attempts_3 = [];
    var defense_stuck_3 = [];
    var defense_assist_3 = [];
    var defense_speed_3 = [];
    var auto_defense_success_3 = [];
    var auto_defense_attempts_3 = [];
    var knockouts_3 = 0;
    var avg_driver_rating_3 = 0;
    var avg_bully_rating_3 = 0;
    var fouls_3 = 0;
    var deads_3 = 0;
    var team_sql_3 = "SELECT * FROM teams WHERE team_number=" + team_number_3;
    connection.query(team_sql_3, function(err, rows, fields) {
      team_name_3 = rows[0].team_name;
      avg_auto_score_3 = rows[0].avg_auton_score;
      avg_contrib_score_3 = rows[0].avg_contrib_score;
      floor_intakes_3 = rows[0].avg_floor_intakes;
      high_made_3 = rows[0].avg_high_made;
      high_attempts_3 = rows[0].avg_high_attempts;
      low_made_3 = rows[0].avg_low_made;
      low_attempts_3 = rows[0].avg_low_attempts;
      auto_high_made_3 = rows[0].auton_high_made;
      auto_high_attempts_3 = rows[0].auton_high_attempts;
      auto_low_made_3 = rows[0].auton_low_made;
      auto_low_attempts_3 = rows[0].auton_low_attempts;
      auto_reaches_3 = rows[0].auton_reaches_total;
      tot_hang_3 = rows[0].total_hangs;
      tot_hang_attempts_3 = rows[0].total_hang_attempts;
      tot_challenge_3 = rows[0].total_challenges;
      tot_challenge_attempts_3 = rows[0].total_challenge_attempts;
      defense_success_3[0] = rows[0].tot_a1_successful;
      defense_attempts_3[0] = rows[0].tot_a1_attempts;
      defense_stuck_3[0] = rows[0].tot_a1_stuck;
      defense_assist_3[0] = rows[0].tot_a1_assisted;
      defense_speed_3[0] = rows[0].avg_a1_speed;
      defense_success_3[1] = rows[0].tot_a2_successful;
      defense_attempts_3[1] = rows[0].tot_a2_attempts;
      defense_stuck_3[1] = rows[0].tot_a2_stuck;
      defense_assist_3[1] = rows[0].tot_a2_assisted;
      defense_speed_3[1] = rows[0].avg_a2_speed;
      defense_success_3[2] = rows[0].tot_b1_successful;
      defense_attempts_3[2] = rows[0].tot_b1_attempts;
      defense_stuck_3[2] = rows[0].tot_b1_stuck;
      defense_assist_3[2] = rows[0].tot_b1_assisted;
      defense_speed_3[2] = rows[0].avg_b1_speed;
      defense_success_3[3] = rows[0].tot_b2_successful;
      defense_attempts_3[3] = rows[0].tot_b2_attempts;
      defense_stuck_3[3] = rows[0].tot_b2_stuck;
      defense_assist_3[3] = rows[0].tot_b2_assisted;
      defense_speed_3[3] = rows[0].avg_b2_speed;
      defense_success_3[4] = rows[0].tot_c1_successful;
      defense_attempts_3[4] = rows[0].tot_c1_attempts;
      defense_stuck_3[4] = rows[0].tot_c1_stuck;
      defense_assist_3[4] = rows[0].tot_c1_assisted;
      defense_speed_3[4] = rows[0].avg_c1_speed;
      defense_success_3[5] = rows[0].tot_c2_successful;
      defense_attempts_3[5] = rows[0].tot_c2_attempts;
      defense_stuck_3[5] = rows[0].tot_c2_stuck;
      defense_assist_3[5] = rows[0].tot_c2_assisted;
      defense_speed_3[5] = rows[0].avg_c2_speed;
      defense_success_3[6] = rows[0].tot_d1_successful;
      defense_attempts_3[6] = rows[0].tot_d1_attempts;
      defense_stuck_3[6] = rows[0].tot_d1_stuck;
      defense_assist_3[6] = rows[0].tot_d1_assisted;
      defense_speed_3[6] = rows[0].avg_d1_speed;
      defense_success_3[7] = rows[0].tot_d2_successful;
      defense_attempts_3[7] = rows[0].tot_d2_attempts;
      defense_stuck_3[7] = rows[0].tot_d2_stuck;
      defense_assist_3[7] = rows[0].tot_d2_assisted;
      defense_speed_3[7] = rows[0].avg_d2_speed;
      defense_success_3[8] = rows[0].tot_lb_successful;
      defense_attempts_3[8] = rows[0].tot_lb_attempts;
      defense_stuck_3[8] = rows[0].tot_lb_stuck;
      defense_assist_3[8] = rows[0].tot_lb_assisted;
      defense_speed_3[8] = rows[0].avg_lb_speed;
      auto_defense_success_3[0] = rows[0].auton_a1;
      auto_defense_attempts_3[0] = rows[0].auton_a1_attempts;
      auto_defense_success_3[1] = rows[0].auton_a2;
      auto_defense_attempts_3[1] = rows[0].auton_a2_attempts;
      auto_defense_success_3[2] = rows[0].auton_b1;
      auto_defense_attempts_3[2] = rows[0].auton_b1_attempts;
      auto_defense_success_3[3] = rows[0].auton_b2;
      auto_defense_attempts_3[3] = rows[0].auton_b2_attempts;
      auto_defense_success_3[4] = rows[0].auton_c1;
      auto_defense_attempts_3[4] = rows[0].auton_c1_attempts;
      auto_defense_success_3[5] = rows[0].auton_c2;
      auto_defense_attempts_3[5] = rows[0].auton_c2_attempts;
      auto_defense_success_3[6] = rows[0].auton_d1;
      auto_defense_attempts_3[6] = rows[0].auton_d1_attempts;
      auto_defense_success_3[7] = rows[0].auton_d2;
      auto_defense_attempts_3[7] = rows[0].auton_d2_attempts;
      auto_defense_success_3[8] = rows[0].auton_lb;
      auto_defense_attempts_3[8] = rows[0].auton_lb_attempts;
      knockouts_3 = rows[0].total_knockouts;
      avg_driver_rating_3 = rows[0].avg_driver_rating;
      avg_bully_rating_3 = rows[0].avg_bully_rating;
      fouls_3 = rows[0].total_fouls;
      deads_3 = rows[0].tot_dead;
    });
    var no_auto_sql_3 = "SELECT * FROM matches WHERE team_number = " + team_number_3 + " AND auton_score = 0"
    var no_autos_3 = 0;
    connection.query(no_auto_sql_3, function(err, rows, fields) {
      for(var x in rows) {
        no_autos_3++;
      }

      res.render("pages/alliance", {
        team_number_1: team_number_1,
        team_name_1: team_name_1,
        avg_auto_score_1: avg_auto_score_1,
        avg_contrib_score_1: avg_contrib_score_1,
        no_autos_1: no_autos_1,
        auto_reaches_1: auto_reaches_1,
        auto_high_made_1: auto_high_made_1,
        auto_high_attempts_1: auto_high_attempts_1,
        auto_low_made_1: auto_low_made_1,
        auto_low_attempts_1: auto_low_attempts_1,
        auto_a1_success_1: auto_defense_success_1[0],
        auto_a1_attempts_1: auto_defense_attempts_1[0],
        auto_a2_success_1: auto_defense_success_1[1],
        auto_a2_attempts_1: auto_defense_attempts_1[1],
        auto_b1_success_1: auto_defense_success_1[2],
        auto_b1_attempts_1: auto_defense_attempts_1[2],
        auto_b2_success_1: auto_defense_success_1[3],
        auto_b2_attempts_1: auto_defense_attempts_1[3],
        auto_c1_success_1: auto_defense_success_1[4],
        auto_c1_attempts_1: auto_defense_attempts_1[4],
        auto_c2_success_1: auto_defense_success_1[5],
        auto_c2_attempts_1: auto_defense_attempts_1[5],
        auto_d1_success_1: auto_defense_success_1[6],
        auto_d1_attempts_1: auto_defense_attempts_1[6],
        auto_d2_success_1: auto_defense_success_1[7],
        auto_d2_attempts_1: auto_defense_attempts_1[7],
        auto_lb_success_1: auto_defense_success_1[8],
        auto_lb_attempts_1: auto_defense_attempts_1[8],
        tele_high_made_1: high_made_1,
        tele_high_attempts_1: high_attempts_1,
        tele_low_made_1: low_made_1,
        tele_low_attempts_1: low_attempts_1,
        avg_driver_rating_1: avg_driver_rating_1,
        avg_bully_rating_1: avg_bully_rating_1,
        knockouts_1: knockouts_1,
        floor_intakes_1: floor_intakes_1,
        deads_1: deads_1,
        fouls_1: fouls_1,
        a1_success_1: defense_success_1[0],
        a1_attempts_1: defense_attempts_1[0],
        a1_rating_1: defense_speed_1[0],
        a1_assist_1: defense_assist_1[0],
        a1_stuck_1: defense_stuck_1[0],
        a2_success_1: defense_success_1[1],
        a2_attempts_1: defense_attempts_1[1],
        a2_rating_1: defense_speed_1[1],
        a2_assist_1: defense_assist_1[1],
        a2_stuck_1: defense_stuck_1[1],
        b1_success_1: defense_success_1[2],
        b1_attempts_1: defense_attempts_1[2],
        b1_rating_1: defense_speed_1[2],
        b1_assist_1: defense_assist_1[2],
        b1_stuck_1: defense_stuck_1[2],
        b2_success_1: defense_success_1[3],
        b2_attempts_1: defense_attempts_1[3],
        b2_rating_1: defense_speed_1[3],
        b2_assist_1: defense_assist_1[3],
        b2_stuck_1: defense_stuck_1[3],
        c1_success_1: defense_success_1[4],
        c1_attempts_1: defense_attempts_1[4],
        c1_rating_1: defense_speed_1[4],
        c1_assist_1: defense_assist_1[4],
        c1_stuck_1: defense_stuck_1[4],
        c2_success_1: defense_success_1[5],
        c2_attempts_1: defense_attempts_1[5],
        c2_rating_1: defense_speed_1[5],
        c2_assist_1: defense_assist_1[5],
        c2_stuck_1: defense_stuck_1[5],
        d1_success_1: defense_success_1[6],
        d1_attempts_1: defense_attempts_1[6],
        d1_rating_1: defense_speed_1[6],
        d1_assist_1: defense_assist_1[6],
        d1_stuck_1: defense_stuck_1[6],
        d2_success_1: defense_success_1[7],
        d2_attempts_1: defense_attempts_1[7],
        d2_rating_1: defense_speed_1[7],
        d2_assist_1: defense_assist_1[7],
        d2_stuck_1: defense_stuck_1[7],
        lb_success_1: defense_success_1[8],
        lb_attempts_1: defense_attempts_1[8],
        lb_rating_1: defense_speed_1[8],
        lb_assist_1: defense_assist_1[8],
        lb_stuck_1: defense_stuck_1[8],
        hang_success_1: tot_hang_1,
        hang_attempts_1: tot_hang_attempts_1,
        challenge_success_1: tot_challenge_1,
        challenge_attempts_1: tot_challenge_attempts_1,
        team_number_2: team_number_2,
        team_name_2: team_name_2,
        avg_auto_score_2: avg_auto_score_2,
        avg_contrib_score_2: avg_contrib_score_2,
        no_autos_2: no_autos_2,
        auto_reaches_2: auto_reaches_2,
        auto_high_made_2: auto_high_made_2,
        auto_high_attempts_2: auto_high_attempts_2,
        auto_low_made_2: auto_low_made_2,
        auto_low_attempts_2: auto_low_attempts_2,
        auto_a1_success_2: auto_defense_success_2[0],
        auto_a1_attempts_2: auto_defense_attempts_2[0],
        auto_a2_success_2: auto_defense_success_2[1],
        auto_a2_attempts_2: auto_defense_attempts_2[1],
        auto_b1_success_2: auto_defense_success_2[2],
        auto_b1_attempts_2: auto_defense_attempts_2[2],
        auto_b2_success_2: auto_defense_success_2[3],
        auto_b2_attempts_2: auto_defense_attempts_2[3],
        auto_c1_success_2: auto_defense_success_2[4],
        auto_c1_attempts_2: auto_defense_attempts_2[4],
        auto_c2_success_2: auto_defense_success_2[5],
        auto_c2_attempts_2: auto_defense_attempts_2[5],
        auto_d1_success_2: auto_defense_success_2[6],
        auto_d1_attempts_2: auto_defense_attempts_2[6],
        auto_d2_success_2: auto_defense_success_2[7],
        auto_d2_attempts_2: auto_defense_attempts_2[7],
        auto_lb_success_2: auto_defense_success_2[8],
        auto_lb_attempts_2: auto_defense_attempts_2[8],
        tele_high_made_2: high_made_2,
        tele_high_attempts_2: high_attempts_2,
        tele_low_made_2: low_made_2,
        tele_low_attempts_2: low_attempts_2,
        avg_driver_rating_2: avg_driver_rating_2,
        avg_bully_rating_2: avg_bully_rating_2,
        knockouts_2: knockouts_2,
        floor_intakes_2: floor_intakes_2,
        deads_2: deads_2,
        fouls_2: fouls_2,
        a1_success_2: defense_success_2[0],
        a1_attempts_2: defense_attempts_2[0],
        a1_rating_2: defense_speed_2[0],
        a1_assist_2: defense_assist_2[0],
        a1_stuck_2: defense_stuck_2[0],
        a2_success_2: defense_success_2[1],
        a2_attempts_2: defense_attempts_2[1],
        a2_rating_2: defense_speed_2[1],
        a2_assist_2: defense_assist_2[1],
        a2_stuck_2: defense_stuck_2[1],
        b1_success_2: defense_success_2[2],
        b1_attempts_2: defense_attempts_2[2],
        b1_rating_2: defense_speed_2[2],
        b1_assist_2: defense_assist_2[2],
        b1_stuck_2: defense_stuck_2[2],
        b2_success_2: defense_success_2[3],
        b2_attempts_2: defense_attempts_2[3],
        b2_rating_2: defense_speed_2[3],
        b2_assist_2: defense_assist_2[3],
        b2_stuck_2: defense_stuck_2[3],
        c1_success_2: defense_success_2[4],
        c1_attempts_2: defense_attempts_2[4],
        c1_rating_2: defense_speed_2[4],
        c1_assist_2: defense_assist_2[4],
        c1_stuck_2: defense_stuck_2[4],
        c2_success_2: defense_success_2[5],
        c2_attempts_2: defense_attempts_2[5],
        c2_rating_2: defense_speed_2[5],
        c2_assist_2: defense_assist_2[5],
        c2_stuck_2: defense_stuck_2[5],
        d1_success_2: defense_success_2[6],
        d1_attempts_2: defense_attempts_2[6],
        d1_rating_2: defense_speed_2[6],
        d1_assist_2: defense_assist_2[6],
        d1_stuck_2: defense_stuck_2[6],
        d2_success_2: defense_success_2[7],
        d2_attempts_2: defense_attempts_2[7],
        d2_rating_2: defense_speed_2[7],
        d2_assist_2: defense_assist_2[7],
        d2_stuck_2: defense_stuck_2[7],
        lb_success_2: defense_success_2[8],
        lb_attempts_2: defense_attempts_2[8],
        lb_rating_2: defense_speed_2[8],
        lb_assist_2: defense_assist_2[8],
        lb_stuck_2: defense_stuck_2[8],
        hang_success_2: tot_hang_2,
        hang_attempts_2: tot_hang_attempts_2,
        challenge_success_2: tot_challenge_2,
        challenge_attempts_2: tot_challenge_attempts_2,
        team_number_3: team_number_3,
        team_name_3: team_name_3,
        avg_auto_score_3: avg_auto_score_3,
        avg_contrib_score_3: avg_contrib_score_3,
        no_autos_3: no_autos_3,
        auto_reaches_3: auto_reaches_3,
        auto_high_made_3: auto_high_made_3,
        auto_high_attempts_3: auto_high_attempts_3,
        auto_low_made_3: auto_low_made_3,
        auto_low_attempts_3: auto_low_attempts_3,
        auto_a1_success_3: auto_defense_success_3[0],
        auto_a1_attempts_3: auto_defense_attempts_3[0],
        auto_a2_success_3: auto_defense_success_3[1],
        auto_a2_attempts_3: auto_defense_attempts_3[1],
        auto_b1_success_3: auto_defense_success_3[2],
        auto_b1_attempts_3: auto_defense_attempts_3[2],
        auto_b2_success_3: auto_defense_success_3[3],
        auto_b2_attempts_3: auto_defense_attempts_3[3],
        auto_c1_success_3: auto_defense_success_3[4],
        auto_c1_attempts_3: auto_defense_attempts_3[4],
        auto_c2_success_3: auto_defense_success_3[5],
        auto_c2_attempts_3: auto_defense_attempts_3[5],
        auto_d1_success_3: auto_defense_success_3[6],
        auto_d1_attempts_3: auto_defense_attempts_3[6],
        auto_d2_success_3: auto_defense_success_3[7],
        auto_d2_attempts_3: auto_defense_attempts_3[7],
        auto_lb_success_3: auto_defense_success_3[8],
        auto_lb_attempts_3: auto_defense_attempts_3[8],
        tele_high_made_3: high_made_3,
        tele_high_attempts_3: high_attempts_3,
        tele_low_made_3: low_made_3,
        tele_low_attempts_3: low_attempts_3,
        avg_driver_rating_3: avg_driver_rating_3,
        avg_bully_rating_3: avg_bully_rating_3,
        knockouts_3: knockouts_3,
        floor_intakes_3: floor_intakes_3,
        deads_3: deads_3,
        fouls_3: fouls_3,
        a1_success_3: defense_success_3[0],
        a1_attempts_3: defense_attempts_3[0],
        a1_rating_3: defense_speed_3[0],
        a1_assist_3: defense_assist_3[0],
        a1_stuck_3: defense_stuck_3[0],
        a2_success_3: defense_success_3[1],
        a2_attempts_3: defense_attempts_3[1],
        a2_rating_3: defense_speed_3[1],
        a2_assist_3: defense_assist_3[1],
        a2_stuck_3: defense_stuck_3[1],
        b1_success_3: defense_success_3[2],
        b1_attempts_3: defense_attempts_3[2],
        b1_rating_3: defense_speed_3[2],
        b1_assist_3: defense_assist_3[2],
        b1_stuck_3: defense_stuck_3[2],
        b2_success_3: defense_success_3[3],
        b2_attempts_3: defense_attempts_3[3],
        b2_rating_3: defense_speed_3[3],
        b2_assist_3: defense_assist_3[3],
        b2_stuck_3: defense_stuck_3[3],
        c1_success_3: defense_success_3[4],
        c1_attempts_3: defense_attempts_3[4],
        c1_rating_3: defense_speed_3[4],
        c1_assist_3: defense_assist_3[4],
        c1_stuck_3: defense_stuck_3[4],
        c2_success_3: defense_success_3[5],
        c2_attempts_3: defense_attempts_3[5],
        c2_rating_3: defense_speed_3[5],
        c2_assist_3: defense_assist_3[5],
        c2_stuck_3: defense_stuck_3[5],
        d1_success_3: defense_success_3[6],
        d1_attempts_3: defense_attempts_3[6],
        d1_rating_3: defense_speed_3[6],
        d1_assist_3: defense_assist_3[6],
        d1_stuck_3: defense_stuck_3[6],
        d2_success_3: defense_success_3[7],
        d2_attempts_3: defense_attempts_3[7],
        d2_rating_3: defense_speed_3[7],
        d2_assist_3: defense_assist_3[7],
        d2_stuck_3: defense_stuck_3[7],
        lb_success_3: defense_success_3[8],
        lb_attempts_3: defense_attempts_3[8],
        lb_rating_3: defense_speed_3[8],
        lb_assist_3: defense_assist_3[8],
        lb_stuck_3: defense_stuck_3[8],
        hang_success_3: tot_hang_3,
        hang_attempts_3: tot_hang_attempts_3,
        challenge_success_3: tot_challenge_3,
        challenge_attempts_3: tot_challenge_attempts_3
      });
    });
  });

  function updateTeams(team_number) {
    console.log("Updating teams for " + team_number);
    var team_sql = "UPDATE teams SET num_matches=(SELECT COUNT(*) FROM matches WHERE team_number=" + team_number + "), " +
    "avg_auton_score=(SELECT AVG(auton_score) FROM matches WHERE team_number=" + team_number + "), "  +
    "avg_contrib_score=(SELECT AVG(contributed_score) FROM matches WHERE team_number=" + team_number + "), " +
    "avg_floor_intakes=(SELECT AVG(tele_floor_intake) FROM matches WHERE team_number=" + team_number + "), " +
    "perc_high_made=100*(SELECT SUM(tele_high_made)/(SUM(tele_high_missed)+SUM(tele_high_made)) FROM matches WHERE team_number=" + team_number + "), " +
    "total_high_made=(SELECT SUM(tele_high_made) FROM matches WHERE team_number=" + team_number + "), " +
    "total_high_attempts=(SELECT SUM(tele_high_made)+SUM(tele_high_missed) FROM matches WHERE team_number=" + team_number + "), " +
    "avg_high_made=(SELECT AVG(tele_high_made) FROM matches WHERE team_number=" + team_number + "), " +
    "avg_high_attempts=(SELECT AVG(tele_high_made+tele_high_missed) FROM matches WHERE team_number=" + team_number + "), " +
    "perc_low_goals=100*(SELECT SUM(tele_low_made)/(SUM(tele_low_missed)+SUM(tele_low_made)) FROM matches WHERE team_number=" + team_number + "), " +
    "total_low_made=(SELECT SUM(tele_low_made) FROM matches WHERE team_number=" + team_number + "), " +
    "total_low_attempts=(SELECT SUM(tele_low_made)+SUM(tele_low_missed) FROM matches WHERE team_number=" + team_number + "), " +
    "avg_low_made=(SELECT AVG(tele_low_made) FROM matches WHERE team_number=" + team_number + "), " +
    "avg_low_attempts=(SELECT AVG(tele_low_made+tele_low_missed) FROM matches WHERE team_number=" + team_number + "), " +
    "perc_auton_high=100*(SELECT SUM(auton_high)/(SUM(auton_high_missed)+SUM(auton_high)) FROM matches WHERE team_number=" + team_number + "), " +
    "auton_high_made=(SELECT SUM(auton_high) FROM matches WHERE team_number=" + team_number + "), " +
    "auton_high_attempts=(SELECT SUM(auton_high)+SUM(auton_high_missed) FROM matches WHERE team_number=" + team_number + "), " +
    "perc_auton_low=100*(SELECT SUM(auton_low)/(SUM(auton_low_missed)+SUM(auton_low)) FROM matches WHERE team_number=" + team_number + "), " +
    "auton_low_made=(SELECT SUM(auton_low) FROM matches WHERE team_number=" + team_number + "), " +
    "auton_low_attempts=(SELECT SUM(auton_low)+SUM(auton_low_missed) FROM matches WHERE team_number=" + team_number + "), " +
    "auton_reaches_total=(SELECT SUM(auton_reach) FROM matches WHERE team_number=" + team_number + "), " +
    "total_auto_crossings=(SELECT COUNT(*) FROM matches WHERE team_number=" + team_number + " AND auton_defense_crossed<>'none'), " +
    "perc_hangs=(SELECT SUM(tele_hang)/(SUM(tele_hang_failed)+SUM(tele_hang)) FROM matches WHERE team_number=" + team_number + "), " +
    "total_hangs=(SELECT SUM(tele_hang) FROM matches WHERE team_number=" + team_number + "), " +
    "total_hang_attempts=(SELECT SUM(tele_hang)+SUM(tele_hang_failed) FROM matches WHERE team_number=" + team_number + "), " +
    "perc_challenges=(SELECT SUM(tele_challenge)/(SUM(tele_challenge_failed)+SUM(tele_challenge)) FROM matches WHERE team_number=" + team_number + "), " +
    "total_challenges=(SELECT SUM(tele_challenge) FROM matches WHERE team_number=" + team_number + "), " +
    "total_challenge_attempts=(SELECT SUM(tele_challenge)+SUM(tele_challenge_failed) FROM matches WHERE team_number=" + team_number + "), " +
    "total_stucks=(SELECT SUM(a2_stuck)+SUM(b1_stuck)+SUM(b2_stuck)+SUM(c2_stuck)+SUM(d1_stuck)+SUM(d2_stuck)+SUM(lb_stuck) FROM matches WHERE team_number=" + team_number + "), " +
    "total_terrains=(SELECT SUM(b1_successful)+SUM(b2_successful)+SUM(d1_successful)+SUM(d2_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "total_defenses=(SELECT SUM(a1_successful)+SUM(a2_successful)+SUM(b1_successful)+SUM(b2_successful)+SUM(c1_successful)+SUM(c2_successful)+SUM(d1_successful)+SUM(d2_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "perc_a1_cross=(SELECT SUM(a1_successful)/SUM(a1_attempts) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_a1_successful=(SELECT SUM(a1_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_a1_attempts=(SELECT SUM(a1_attempts) FROM matches WHERE team_number = " + team_number + "), " +
    "tot_a1_stuck=(SELECT SUM(a1_stuck) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_a1_assisted=(SELECT SUM(a1_assists) FROM matches WHERE team_number=" + team_number + "), " +
    "avg_a1_speed=(SELECT SUM(a1_total) FROM matches WHERE team_number=" + team_number + ")/(SELECT SUM(a1_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "perc_a2_cross=(SELECT SUM(a1_successful)/SUM(a1_attempts) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_a2_successful=(SELECT SUM(a2_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_a2_attempts=(SELECT SUM(a2_attempts) FROM matches WHERE team_number = " + team_number + "), " +
    "tot_a2_stuck=(SELECT SUM(a2_stuck) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_a2_assisted=(SELECT SUM(a2_assists) FROM matches WHERE team_number=" + team_number + "), " +
    "avg_a2_speed=(SELECT SUM(a2_total) FROM matches WHERE team_number=" + team_number + ")/(SELECT SUM(a2_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "perc_b1_cross=(SELECT SUM(b1_successful)/SUM(b1_attempts) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_b1_successful=(SELECT SUM(b1_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_b1_attempts=(SELECT SUM(b1_attempts) FROM matches WHERE team_number = " + team_number + "), " +
    "tot_b1_stuck=(SELECT SUM(b1_stuck) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_b1_assisted=(SELECT SUM(b1_assists) FROM matches WHERE team_number=" + team_number + "), " +
    "avg_b1_speed=(SELECT SUM(b1_total) FROM matches WHERE team_number=" + team_number + ")/(SELECT SUM(b1_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "perc_b2_cross=(SELECT SUM(b2_successful)/SUM(b2_attempts) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_b2_successful=(SELECT SUM(b2_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_b2_attempts=(SELECT SUM(b2_attempts) FROM matches WHERE team_number = " + team_number + "), " +
    "tot_b2_stuck=(SELECT SUM(b2_stuck) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_b2_assisted=(SELECT SUM(b2_assists) FROM matches WHERE team_number=" + team_number + "), " +
    "avg_b2_speed=(SELECT SUM(b2_total) FROM matches WHERE team_number=" + team_number + ")/(SELECT SUM(b2_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "perc_c1_cross=(SELECT SUM(c1_successful)/SUM(c1_attempts) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_c1_successful=(SELECT SUM(c1_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_c1_attempts=(SELECT SUM(c1_attempts) FROM matches WHERE team_number = " + team_number + "), " +
    "tot_c1_stuck=(SELECT SUM(c1_stuck) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_c1_assisted=(SELECT SUM(c1_assists) FROM matches WHERE team_number=" + team_number + "), " +
    "avg_c1_speed=(SELECT SUM(c1_total) FROM matches WHERE team_number=" + team_number + ")/(SELECT SUM(c1_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "perc_c2_cross=(SELECT SUM(c2_successful)/SUM(c2_attempts) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_c2_successful=(SELECT SUM(c2_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_c2_attempts=(SELECT SUM(c2_attempts) FROM matches WHERE team_number = " + team_number + "), " +
    "tot_c2_stuck=(SELECT SUM(c2_stuck) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_c2_assisted=(SELECT SUM(c2_assists) FROM matches WHERE team_number=" + team_number + "), " +
    "avg_c2_speed=(SELECT SUM(c2_total) FROM matches WHERE team_number=" + team_number + ")/(SELECT SUM(c2_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "perc_d1_cross=(SELECT SUM(d1_successful)/SUM(d1_attempts) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_d1_successful=(SELECT SUM(d1_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_d1_attempts=(SELECT SUM(d1_attempts) FROM matches WHERE team_number = " + team_number + "), " +
    "tot_d1_stuck=(SELECT SUM(d1_stuck) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_d1_assisted=(SELECT SUM(d1_assists) FROM matches WHERE team_number=" + team_number + "), " +
    "avg_d1_speed=(SELECT SUM(d1_total) FROM matches WHERE team_number=" + team_number + ")/(SELECT SUM(d1_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "perc_d2_cross=(SELECT SUM(d2_successful)/SUM(d2_attempts) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_d2_successful=(SELECT SUM(d2_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_d2_attempts=(SELECT SUM(d2_attempts) FROM matches WHERE team_number = " + team_number + "), " +
    "tot_d2_stuck=(SELECT SUM(d2_stuck) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_d2_assisted=(SELECT SUM(d2_assists) FROM matches WHERE team_number=" + team_number + "), " +
    "avg_d2_speed=(SELECT SUM(d2_total) FROM matches WHERE team_number=" + team_number + ")/(SELECT SUM(d2_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "perc_lb_cross=(SELECT SUM(lb_successful)/SUM(lb_attempts) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_lb_successful=(SELECT SUM(lb_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_lb_attempts=(SELECT SUM(lb_attempts) FROM matches WHERE team_number = " + team_number + "), " +
    "tot_lb_stuck=(SELECT SUM(lb_stuck) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_lb_assisted=(SELECT SUM(lb_assists) FROM matches WHERE team_number=" + team_number + "), " +
    "avg_lb_speed=(SELECT SUM(lb_total) FROM matches WHERE team_number=" + team_number + ")/(SELECT SUM(lb_successful) FROM matches WHERE team_number=" + team_number + "), " +
    "auton_a1=(SELECT COUNT(*) FROM matches WHERE team_number=" + team_number + " AND auton_defense_crossed='PC' AND auton_defense_total<>0), " +
    "auton_a1_attempts=((SELECT COUNT(*) FROM matches WHERE team_number = " + team_number + " AND auton_defense_crossed='PC' AND auton_defense_total<>0)+(SELECT COUNT(*) FROM matches WHERE team_number = " + team_number + " AND auton_defense_crossed='CF' AND auton_defense_total=0)), " +
    "auton_a1_perc=100*(auton_a1/auton_a1_attempts), " +
    "auton_a2=(SELECT COUNT(*) FROM matches WHERE team_number=" + team_number + " AND auton_defense_crossed='CF' AND auton_defense_total<>0), " +
    "auton_a2_attempts=((SELECT COUNT(*) FROM matches WHERE team_number = " + team_number + " AND auton_defense_crossed='CF' AND auton_defense_total<>0)+(SELECT COUNT(*) FROM matches WHERE team_number = " + team_number + " AND auton_defense_crossed='CF' AND auton_defense_total=0)), " +
    "auton_a2_perc=100*(auton_a2/auton_a2_attempts), " +
    "auton_b1=(SELECT COUNT(*) FROM matches WHERE team_number=" + team_number + " AND auton_defense_crossed='M' AND auton_defense_total<>0), " +
    "auton_b1_attempts=((SELECT COUNT(*) FROM matches WHERE team_number = " + team_number + " AND auton_defense_crossed='M' AND auton_defense_total<>0)+(SELECT COUNT(*) FROM matches WHERE team_number = " + team_number + " AND auton_defense_crossed='M' AND auton_defense_total=0)), " +
    "auton_b1_perc=100*(auton_b1/auton_b1_attempts), " +
    "auton_b2=(SELECT COUNT(*) FROM matches WHERE team_number=" + team_number + " AND auton_defense_crossed='RP' AND auton_defense_total<>0), " +
    "auton_b2_attempts=((SELECT COUNT(*) FROM matches WHERE team_number = " + team_number + " AND auton_defense_crossed='RP' AND auton_defense_total<>0)+(SELECT COUNT(*) FROM matches WHERE team_number = " + team_number + " AND auton_defense_crossed='RP' AND auton_defense_total=0)), " +
    "auton_b2_perc=100*(auton_b2/auton_b2_attempts), " +
    "auton_c1=(SELECT COUNT(*) FROM matches WHERE team_number=" + team_number + " AND auton_defense_crossed='DB' AND auton_defense_total<>0), " +
    "auton_c1_attempts=((SELECT COUNT(*) FROM matches WHERE team_number = " + team_number + " AND auton_defense_crossed='DB' AND auton_defense_total<>0)+(SELECT COUNT(*) FROM matches WHERE team_number = " + team_number + " AND auton_defense_crossed='SP' AND auton_defense_total=0)), " +
    "auton_c1_perc=100*(auton_c1/auton_c1_attempts), " +
    "auton_c2=(SELECT COUNT(*) FROM matches WHERE team_number=" + team_number + " AND auton_defense_crossed='SP' AND auton_defense_total<>0), " +
    "auton_c2_attempts=((SELECT COUNT(*) FROM matches WHERE team_number = " + team_number + " AND auton_defense_crossed='SP' AND auton_defense_total<>0)+(SELECT COUNT(*) FROM matches WHERE team_number = " + team_number + " AND auton_defense_crossed='SP' AND auton_defense_total=0)), " +
    "auton_c2_perc=100*(auton_c2/auton_c2_attempts), " +
    "auton_d1=(SELECT COUNT(*) FROM matches WHERE team_number=" + team_number + " AND auton_defense_crossed='RW' AND auton_defense_total<>0), " +
    "auton_d1_attempts=((SELECT COUNT(*) FROM matches WHERE team_number = " + team_number + " AND auton_defense_crossed='RW' AND auton_defense_total<>0)+(SELECT COUNT(*) FROM matches WHERE team_number = " + team_number + " AND auton_defense_crossed='RW' AND auton_defense_total=0)), " +
    "auton_d1_perc=100*(auton_d1/auton_d1_attempts), " +
    "auton_d2=(SELECT COUNT(*) FROM matches WHERE team_number=" + team_number + " AND auton_defense_crossed='RT' AND auton_defense_total<>0), " +
    "auton_d2_attempts=((SELECT COUNT(*) FROM matches WHERE team_number = " + team_number + " AND auton_defense_crossed='RT' AND auton_defense_total<>0)+(SELECT COUNT(*) FROM matches WHERE team_number = " + team_number + " AND auton_defense_crossed='RT' AND auton_defense_total=0)), " +
    "auton_d2_perc=100*(auton_d2/auton_d2_attempts), " +
    "auton_lb=(SELECT COUNT(*) FROM matches WHERE team_number=" + team_number + " AND auton_defense_crossed='LB' AND auton_defense_total<>0), " +
    "auton_lb_attempts=((SELECT COUNT(*) FROM matches WHERE team_number = " + team_number + " AND auton_defense_crossed='LB' AND auton_defense_total<>0)+(SELECT COUNT(*) FROM matches WHERE team_number = " + team_number + " AND auton_defense_crossed='LB' AND auton_defense_total=0)), " +
    "auton_lb_perc=100*(auton_lb/auton_lb_attempts), " +
    "total_knockouts=(SELECT SUM(tele_knock_out) FROM matches WHERE team_number=" + team_number + "), " +
    "avg_driver_rating=(SELECT AVG(driver_rating) FROM matches WHERE team_number=" + team_number + "), " +
    "avg_bully_rating=(SELECT AVG(bully_rating) FROM matches WHERE team_number=" + team_number + "), " +
    "total_fouls=(SELECT SUM(fouls_noticed) FROM matches WHERE team_number=" + team_number + "), " +
    "tot_dead=(SELECT SUM(dead) FROM matches WHERE team_number=" + team_number + ") " +
    "WHERE team_number=" + team_number;
    connection.query(team_sql, function(err) {
      if(err)
        console.log(err);
    });
  }
};

module.exports = rest_router;
