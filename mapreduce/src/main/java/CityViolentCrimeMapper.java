import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

public class CityViolentCrimeMapper
extends Mapper<LongWritable, Text, Text, IntWritable> {

    private final static IntWritable one =
            new IntWritable(1);

    private Text city =
            new Text();

    public void map(LongWritable key,
                    Text value,
                    Context context)
            throws IOException, InterruptedException {

        String line = value.toString();

        if(line.startsWith("Report Number"))
            return;

        String[] fields = line.split(",");

        try {

            String cityName =
                    fields[4].trim();

            String crimeDomain =
                    fields[10].trim();

            if(crimeDomain.equalsIgnoreCase(
                    "Violent Crime")) {

                city.set(cityName);

                context.write(
                        city,
                        one
                );
            }

        }
        catch(Exception e) {

        }
    }
}