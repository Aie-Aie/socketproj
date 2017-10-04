create table units(
	socketname text,
	socketid text primary key,
	num_pin int8

)

create table pinconfig(
		socketid text primary key references units(socketid),
		pin_num int8,
		x_coor real,
		y_coor real
)

create or replace function newunits(par_socketname text, par_socketid text, par_numpin int8) returns text as
	$$
		declare
			loc_id text;
			loc_result text;

		begin
			select into loc_id socketid from units where socketid=par_socketid;

			if loc_id isnull then
				insert into units (socketname, socketid, num_pin) values (par_socketname, par_socketid, par_numpin);
				loc_result ='Unit added';

			else
				loc_result='Unit exists';
			end if;
				return loc_result;

		end;
	$$
		language 'plpgsql';

-- select newunits('AD123', '1234567', 8);

create or replace function assignpin(par_socketid text, par_pin_num int8, par_x_coor real, par_y_coor real) returns text as
	$$
		declare
			loc_result text;
			loc_id text;

		begin
			select into loc_id socketid from pinconfig where socketid=par_socketid;

			if loc_id isnull then
				insert into pinconfig(socketid, pin_num, x_coor, y_coor) values (par_socketid, par_pin_num, par_x_coor, par_y_coor);
				loc_result ='Pin assigned';

			else
				loc_result='Pin assignment exists';
			end if;
				return loc_result;

		end;

	$$
	language 'plpgsql';

-- select assignpin('1234567', 48, 60, 60);


create or replace function getassignpin(in par_socketid text,out text, out int8, out real, out real) returns setof record as
	$$
		Select units.socketname, pinconfig.pin_num, pinconfig.x_coor, pinconfig.y_coor from units, pinconfig where units.socketid=par_socketid and units.socketid=pinconfig.socketid;
	$$

	language 'sql';



